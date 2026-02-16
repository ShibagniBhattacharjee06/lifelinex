import { useState, useContext, useEffect } from 'react';
import AuthContext from '../context/AuthContext';
import { motion } from 'framer-motion';
import { MapContainer, TileLayer, Marker, useMap, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { MapPinIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import axios from 'axios';
import HealthcareNavbar from '../components/HealthcareNavbar';
import LanguageSelector from '../components/LanguageSelector';

// Fix Leaflet Marker Icons
import L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

const LocationPicker = ({ location, setLocation }) => {
    const map = useMap();
    useEffect(() => {
        if (location) map.flyTo(location, 15);
    }, [location, map]);

    useMapEvents({
        click(e) {
            setLocation([e.latlng.lat, e.latlng.lng]);
        },
    });

    return location ? <Marker position={location} /> : null;
};

const Profile = () => {
    const { user, updateUserData } = useContext(AuthContext);
    const [name, setName] = useState('');
    const [location, setLocation] = useState(null);
    const [msg, setMsg] = useState('');

    useEffect(() => {
        if (user) {
            setName(user.name || '');
            if (user.location?.coordinates) {
                // GeoJSON is [lng, lat], Leaflet is [lat, lng]
                setLocation([user.location.coordinates[1], user.location.coordinates[0]]);
            }
        }
    }, [user]);

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const config = { headers: { Authorization: `Bearer ${token}` } };

            const payload = {
                name,
                location: location ? { type: 'Point', coordinates: [location[1], location[0]] } : undefined
            };

            const { data } = await axios.put(`${import.meta.env.VITE_API_URL}/api/auth/update`, payload, config);
            updateUserData(data);
            setMsg('Profile Updated Successfully!');
            setTimeout(() => setMsg(''), 3000);
        } catch (err) {
            console.error(err);
            setMsg('Failed to update profile.');
        }
    };

    const handleGetCurrentLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setLocation([position.coords.latitude, position.coords.longitude]);
                },
                (err) => alert("Could not fetch location.")
            );
        }
    };

    if (!user) return <div className="p-10 text-center">Loading...</div>;

    return (
        <div className="min-h-screen bg-slate-50 relative pt-24 pb-12 px-6 overflow-x-hidden">
            <HealthcareNavbar />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-4xl mx-auto bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100"
            >
                <div className="bg-primary p-8 text-white relative">
                    <h1 className="text-3xl font-bold">My Profile</h1>
                    <p className="opacity-80">Manage your account and location settings</p>
                </div>

                <div className="p-8">
                    {msg && (
                        <div className={`p-4 rounded-xl mb-6 flex items-center gap-2 ${msg.includes('Success') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                            <CheckCircleIcon className="w-5 h-5" /> {msg}
                        </div>
                    )}

                    <form onSubmit={handleUpdate} className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">Full Name</label>
                                <input
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 focus:ring-2 focus:ring-primary outline-none"
                                    value={name}
                                    onChange={e => setName(e.target.value)}
                                />
                            </div>

                            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                                <h3 className="font-bold text-slate-700 mb-2">Account Details</h3>
                                <p className="text-slate-500 text-sm">Role: <span className="font-semibold capitalize text-primary">{user.role}</span></p>
                                <p className="text-slate-500 text-sm">Email: {user.email}</p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <label className="block text-sm font-bold text-slate-700">Current Location (Drag pin to update)</label>
                                <button type="button" onClick={handleGetCurrentLocation} className="text-primary text-sm font-bold flex items-center gap-1 hover:underline">
                                    <MapPinIcon className="w-4 h-4" /> Use GPS
                                </button>
                            </div>
                            <div className="h-64 bg-slate-100 rounded-2xl overflow-hidden border border-slate-200 relative z-0">
                                {location ? (
                                    <MapContainer center={location} zoom={13} className="h-full w-full">
                                        <TileLayer url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png" attribution='&copy; OpenStreetMap' />
                                        <LocationPicker location={location} setLocation={setLocation} />
                                    </MapContainer>
                                ) : (
                                    <div className="h-full flex items-center justify-center text-slate-400">Loading Map...</div>
                                )}
                            </div>
                        </div>

                        <div className="md:col-span-2 pt-4 border-t border-slate-100">
                            <button type="submit" className="bg-primary hover:bg-primary-dark text-white px-8 py-3 rounded-xl font-bold shadow-lg transition-transform hover:scale-105">
                                Save Changes
                            </button>
                        </div>
                    </form>
                </div>
            </motion.div>
        </div>
    );
};

export default Profile;
