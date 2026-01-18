// Abstracted Notification Service (SMS, Email, Push)

exports.sendEmergencyAlert = async (contactNumber, patientName, type, link) => {
    console.log(`[MOCK SMS] To: ${contactNumber}`);
    console.log(`[MOCK SMS] Body: URGENT! ${patientName} has raised an SOS (${type}). Track here: ${link}`);
    // In prod: await twilio.messages.create(...)
};

exports.notifyResponder = async (fcmToken, message) => {
    console.log(`[MOCK PUSH] To: ${fcmToken} | Msg: ${message}`);
};
