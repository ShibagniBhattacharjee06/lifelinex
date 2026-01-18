# LifeLineX (formerly ERBNS)

A full-stack emergency response platform built with MERN stack.

## Prerequisites
- Node.js (v14+)
- MongoDB (Running locally on default port 27017)

## Installation

1. **Backend Integration**
   ```bash
   cd server
   npm install
   ```
   Create a `.env` file in `server/` (already created):
   ```
   MONGO_URI=mongodb://localhost:27017/erbns
   JWT_SECRET=your_secret
   PORT=5000
   ```

2. **Frontend Integration**
   ```bash
   cd client
   npm install
   ```

## Running the App

Double-click `start.bat` in the root directory.

OR run manually:
- **Server**: `cd server && npm run dev` (Runs on http://localhost:5000)
- **Client**: `cd client && npm run dev` (Runs on http://localhost:5173)

## Features
- **User**: Register, Login, Send SOS, View Map.
- **donor**: Register with blood group, Receive alerts.
- **Hospital**: Manage inventory (beds/blood).

## Testing
1. Register a user as "Hospital" to view the hospital dashboard.
2. Register another user as "User".
3. From "User" dashboard, click "Send SOS".
4. "Hospital" dashboard should receive a real-time alert (if page is open).
