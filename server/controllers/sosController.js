const SOSRequest = require('../models/SOSRequest');
const aiService = require('../services/aiService');
const dispatcherService = require('../services/dispatcherService');
const notificationService = require('../services/notificationService');

// @desc    Create new SOS
// @route   POST /api/sos
// @access  Private
exports.createSOS = async (req, res) => {
    const { type, description, latitude, longitude, bloodGroup } = req.body;
    const io = req.app.get('socketio');

    try {
        console.log("LOG: Fetching user...");
        const user = await req.user;

        // 1. AI Priority Scoring
        console.log("LOG: Calculating Priority...");
        const priority = aiService.calculatePriority(type, bloodGroup, user.medicalHistory);

        console.log("LOG: Creating SOS Request...");
        const sos = await SOSRequest.create({
            user: req.user.id,
            type,
            description,
            bloodGroup: bloodGroup || undefined, // Send undefined to skip enum check if null
            contactNumber: user.phone,
            priorityScore: priority,
            timeline: [{ status: 'created', details: 'Emergency Alert Raised' }],
            location: {
                type: 'Point',
                coordinates: [longitude, latitude]
            }
        });

        // 2. Dispatcher: Find & Filter Responders
        try {
            console.log("LOG: Dispatching...");
            let responders = await dispatcherService.findNearbyResponders(latitude, longitude, 10);
            console.log(`LOG: Found ${responders.length} responders nearby.`);
            responders = dispatcherService.filterEligibleDonors(responders, bloodGroup);
        } catch (dispatchErr) {
            console.error("LOG: Dispatch Error (Non-fatal):", dispatchErr);
        }

        // 3. Notify Emergency Contact (Async)
        if (user.emergencyContact) {
            notificationService.sendEmergencyAlert(
                user.emergencyContact,
                user.name,
                type,
                `https://lifelinex.com/track/${sos._id}`
            );
        }

        const populatedSOS = await SOSRequest.findById(sos._id).populate('user', 'name phone profileImage');

        // 4. Real-time Broadcast
        if (io) io.emit('new_sos', populatedSOS);

        res.json(populatedSOS);
    } catch (err) {
        console.error("LOG: Critical SOS Error:", err);
        res.status(500).send('Server Error: ' + err.message);
    }
};

// @route   GET /api/sos/:id/report
// @access  Private
exports.generateReport = async (req, res) => {
    const PDFDocument = require('pdfkit');

    try {
        const sos = await SOSRequest.findById(req.params.id)
            .populate('user', 'name phone email')
            .populate('responders.user', 'name role phone');

        if (!sos) return res.status(404).send('SOS Not Found');

        const doc = new PDFDocument({ margin: 50, size: 'A4' });
        const filename = `Report-LifeLineX-${sos._id}.pdf`;

        res.setHeader('Content-disposition', `attachment; filename="${filename}"`);
        res.setHeader('Content-type', 'application/pdf');

        doc.pipe(res);

        // --- Colors & Styles ---
        const primaryColor = '#DC2626'; // Red-600
        const secondaryColor = '#1E293B'; // Slate-800
        const accentColor = '#64748B'; // Slate-500
        const lightBg = '#F1F5F9'; // Slate-100

        // --- Header Section ---
        // Draw Header Background
        doc.rect(0, 0, 595.28, 120).fill(secondaryColor);

        // Logo / Brand Name
        doc.fillColor('white').fontSize(30).font('Helvetica-Bold').text('LifeLineX', 50, 40);
        doc.fillColor('#F87171').fontSize(12).font('Helvetica').text('Live Emergency Response Network', 50, 75);

        // Report Title (Right Aligned in Header)
        doc.fillColor('white').fontSize(20).text('EMERGENCY INCIDENT REPORT', 250, 45, { align: 'right' });
        doc.fontSize(10).text(`Generated: ${new Date().toLocaleString()}`, 250, 75, { align: 'right', color: '#94A3B8' });

        doc.moveDown(4);

        // --- Case Overview ---
        const startY = 140;

        // Status Badge
        doc.roundedRect(450, 135, 100, 25, 12).fill(sos.status === 'resolved' ? '#10B981' : '#EF4444');
        doc.fillColor('white').fontSize(10).font('Helvetica-Bold').text(sos.status.toUpperCase(), 450, 142, { width: 100, align: 'center' });

        doc.fillColor(secondaryColor).fontSize(16).font('Helvetica-Bold').text('Case Overview', 50, startY);
        doc.moveDown(0.5);
        doc.strokeColor(accentColor).lineWidth(0.5).moveTo(50, doc.y).lineTo(550, doc.y).stroke();
        doc.moveDown(1);

        // Grid Layout for Key Info
        const col1 = 50;
        const col2 = 300;
        const rowHeight = 20;
        let currentY = doc.y;

        const drawField = (label, value, x, y) => {
            doc.fillColor(accentColor).fontSize(10).font('Helvetica').text(label, x, y);
            doc.fillColor(secondaryColor).fontSize(11).font('Helvetica-Bold').text(value || 'N/A', x, y + 12);
        };

        drawField('Case ID', sos._id.toString(), col1, currentY);
        drawField('Incident Type', sos.type.toUpperCase(), col2, currentY);
        currentY += 40;

        drawField('Patient Name', sos.user?.name || 'Unknown', col1, currentY);
        drawField('Contact Number', sos.user?.phone || sos.contactNumber || 'N/A', col2, currentY);
        currentY += 40;

        drawField('Reported Time', new Date(sos.createdAt).toLocaleString(), col1, currentY);
        drawField('Blood Group / Priority', `${sos.bloodGroup || 'N/A'} (Score: ${sos.priorityScore})`, col2, currentY);

        doc.y = currentY + 40;

        // --- Location ---
        doc.moveDown(1);
        doc.fillColor(secondaryColor).fontSize(16).text('Location Details');
        doc.strokeColor(accentColor).lineWidth(0.5).moveTo(50, doc.y).lineTo(550, doc.y).stroke();
        doc.moveDown(1);

        doc.fillColor(secondaryColor).fontSize(11).text(`Coordinates: ${sos.location.coordinates[1]}, ${sos.location.coordinates[0]}`);
        doc.fontSize(10).fillColor('blue').text('Open in Google Maps', {
            link: `https://www.google.com/maps?q=${sos.location.coordinates[1]},${sos.location.coordinates[0]}`,
            underline: true
        });

        doc.moveDown(2);

        // --- Timeline Table ---
        doc.fillColor(secondaryColor).fontSize(16).font('Helvetica-Bold').text('Incident Timeline');
        doc.strokeColor(accentColor).lineWidth(0.5).moveTo(50, doc.y).lineTo(550, doc.y).stroke();
        doc.moveDown(1);

        // Table Header
        let tableY = doc.y;
        doc.rect(50, tableY, 500, 25).fill(lightBg);
        doc.fillColor(secondaryColor).fontSize(10).font('Helvetica-Bold');
        doc.text('Time', 60, tableY + 8);
        doc.text('Status', 180, tableY + 8);
        doc.text('Details', 300, tableY + 8);

        tableY += 30;

        // Table Rows
        doc.font('Helvetica').fontSize(10);
        sos.timeline.forEach((event, i) => {
            const time = new Date(event.timestamp).toLocaleTimeString();
            const status = event.status.toUpperCase();

            // Alternating Row Background
            if (i % 2 !== 0) doc.rect(50, tableY - 5, 500, 20).fill(lightBg);

            doc.fillColor(secondaryColor);
            doc.text(time, 60, tableY);

            // Status Color based on type
            let statusColor = secondaryColor;
            if (status.includes('CREATED')) statusColor = '#EF4444';
            if (status.includes('RESOLVED')) statusColor = '#10B981';
            doc.fillColor(statusColor).text(status, 180, tableY);

            doc.fillColor(secondaryColor).text(event.details || '-', 300, tableY, { width: 240 });

            tableY += 25;
        });

        doc.moveDown(2);

        // --- Responders Section ---
        if (sos.responders && sos.responders.length > 0) {
            doc.y = tableY + 20; // Ensure we are below the table
            doc.fillColor(secondaryColor).fontSize(16).font('Helvetica-Bold').text('Response Team');
            doc.strokeColor(accentColor).lineWidth(0.5).moveTo(50, doc.y).lineTo(550, doc.y).stroke();
            doc.moveDown(1);

            sos.responders.forEach(r => {
                doc.roundedRect(50, doc.y, 495, 40, 5).stroke(lightBg);
                const responderY = doc.y + 12;

                doc.fillColor(primaryColor).fontSize(12).font('Helvetica-Bold').text(r.user?.name || 'Unknown Responder', 65, responderY);
                doc.fillColor(accentColor).fontSize(10).font('Helvetica').text(`Role: ${r.user?.role?.toUpperCase() || 'N/A'}`, 300, responderY);
                doc.fillColor('#10B981').fontSize(10).font('Helvetica-Bold').text(r.status.toUpperCase(), 450, responderY, { align: 'right', width: 80 });

                doc.moveDown(3);
            });
        }

        // --- Footer ---
        const bottom = doc.page.height - 50;
        doc.fontSize(8).fillColor(accentColor).text('This is an automated report generated by LifeLineX System.', 50, bottom, { align: 'center' });
        doc.text('Confidential Document - For Medical/Official Use Only', 50, bottom + 12, { align: 'center' });

        doc.end();

    } catch (err) {
        console.error(err);
        res.status(500).send('Error generating report');
    }
};

// @desc    Get active SOS nearby
// @route   GET /api/sos/active
// @access  Private
exports.getActiveSOS = async (req, res) => {
    // Return all active for MVP. Ideally filter by loc.
    try {
        const sosList = await SOSRequest.find({ status: 'active' }).populate('user', 'name phone profileImage').sort({ createdAt: -1 });
        res.json(sosList);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Respond to SOS
// @route   PUT /api/sos/:id/respond
// @access  Private (Hospital/Donor)
exports.respondToSOS = async (req, res) => {
    const io = req.app.get('socketio');
    try {
        const sos = await SOSRequest.findById(req.params.id);
        if (!sos) return res.status(404).json({ msg: 'SOS not found' });

        // Lock Logic: Check if already accepted? 
        // For Enterprise, we allow multiple responders but track them.

        const responderExists = sos.responders.some(r => r.user.toString() === req.user.id);
        if (!responderExists) {
            sos.responders.push({ user: req.user.id, status: 'accepted' });
            sos.timeline.push({
                status: 'acknowledged',
                details: `${req.user.name} (${req.user.role}) accepted the request.`
            });
            await sos.save();

            // Notify User
            io.emit('sos_response', { sosId: sos._id, responder: req.user.name });

            // Timeline Update
            io.emit('timeline_update', { sosId: sos._id, timeline: sos.timeline });
        }

        res.json(sos);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};
