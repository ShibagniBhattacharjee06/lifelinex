const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || "*", // Use env var for production security
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || "*"
}));
app.use(helmet());
app.use(express.json({ limit: '50mb' })); // Increased limit for Base64 images
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Database Connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected');
  } catch (err) {
    console.error('MongoDB Connection Error:', err.message);
    // Retry after 5 seconds
    setTimeout(connectDB, 5000);
  }
};
connectDB();

// Test Route
app.get('/', (req, res) => {
  res.send('ERBNS API Running');
});

// Socket.io Logic
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('join_room', (data) => {
    socket.join(data);
    console.log(`User with ID: ${socket.id} joined room: ${data}`);
  });

  socket.on('send_sos', (data) => {
    // Broadcast SOS to everyone (or filter by location in future)
    socket.broadcast.emit('receive_sos', data);
    console.log('SOS Broadcasted:', data);
  });

  socket.on('disconnect', () => {
    console.log('User Disconnected', socket.id);
  });
});

// Make io accessible in routes
app.set('socketio', io);

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/resources', require('./routes/resourceRoutes'));
app.use('/api/sos', require('./routes/sosRoutes'));
app.use('/api/analytics', require('./routes/analyticsRoutes'));

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
