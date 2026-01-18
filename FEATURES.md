# Features of ERBNS (Emergency Resource & Blood Network System)

This system is designed to connect patients, hospitals, and donors in real-time during emergencies.

## 1. 🚨 For General Users (Public)
The "Panic Button" for everyday users.
- **One-Tap SOS**: A massive, pulsing button to instantly broadcast an emergency.
- **Live Location Sharing**: Your GPS coordinates are automatically sent to the nearest responders.
- **Resource Map**: A "Google Maps" style view showing all nearby:
    - Hospitals (with Bed/ICU availability)
    - Blood Banks (with stock levels)
    - Active Ambulances

## 2. 🏥 For Hospitals & Blood Banks
A command center to manage emergencies.
- **Real-Time Alert Feed**: Instantly receive SOS requests from users nearby with a distinct alarm sound/visual (simulated).
- **Incident Details**: See the exact type of emergency (Accident, Cardiac, etc.) and location on the map.
- **Inventory Management**: Update your live stock of:
    - Blood Groups (A+, O-, etc.)
    - Oxygen Cylinders
    - ICU Beds

## 3. 🩸 For Blood Donors
Helping the community.
- **Donor Profile**: Register with your specific blood group and last donation date.
- **Emergency Notifications**: Get notified if someone nearby desperately needs your specific blood type.

## 4. 💻 Technical & UI Features
- **Professional Glassmorphism UI**: modern, translucent design aesthetics.
- **Smooth Animations**: Transitions and pulse effects for a premium feel.
- **Secure Authentication**: Encrypted passwords and role-based security.
- **Live Connectivity**: Uses WebSockets (Socket.io) for sub-second updates.
