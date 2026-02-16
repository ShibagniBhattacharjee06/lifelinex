import { useState, useContext, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { MapContainer, TileLayer, Marker, useMap, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { UserCircleIcon, LockClosedIcon, CheckBadgeIcon, MapPinIcon } from '@heroicons/react/24/outline';
import { useTranslation } from 'react-i18next';

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

    // Auto-fly to location when updated from "Find Me"
    useEffect(() => {
        if (location) {
            map.flyTo(location, 15);
        }
    }, [location, map]);

    useMapEvents({
        click(e) {
            setLocation([e.latlng.lat, e.latlng.lng]);
        },
    });

    return location ? <Marker position={location} /> : null;
};

const Register = () => {
    const [formData, setFormData] = useState({
        name: '', email: '', password: '', phone: '', role: 'user',
        bloodGroup: '', hospitalName: '', type: 'Hospital', address: ''
    });
    const [location, setLocation] = useState([20.5937, 78.9629]); // India Default
    const [useCurrentLoc, setUseCurrentLoc] = useState(false);

    const { register } = useContext(AuthContext);
    const navigate = useNavigate();
    const { t } = useTranslation();

    const handleGetCurrentLocation = () => {
        if (navigator.geolocation) {
            setUseCurrentLoc(true);
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    setLocation([latitude, longitude]);
                    setUseCurrentLoc(false);
                },
                (error) => {
                    console.error("Error obtaining location", error);
                    alert("Could not get your location. Please drop a pin manually.");
                    setUseCurrentLoc(false);
                }
            );
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                ...formData,
                location: location,
                extraData: {
                    bloodGroup: formData.bloodGroup,
                    hospitalName: formData.hospitalName,
                    type: formData.type,
                    address: formData.address
                }
            };
            await register(payload);
            navigate('/dashboard');
        } catch (err) {
            alert('Registration Failed');
        }
    };

    const inputClass = "w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl py-3 px-4 focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none placeholder-slate-400";
    const labelClass = "block text-slate-600 text-sm font-bold mb-2 ml-1";

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 py-8 md:py-12 relative overflow-x-hidden">
            {/* Premium Background */}
            <div className="absolute top-0 right-0 w-[60%] h-[60%] bg-primary-light/10 rounded-full blur-[120px] pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-[40%] h-[40%] bg-accent/5 rounded-full blur-[100px] pointer-events-none"></div>

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="w-full max-w-5xl bg-white/80 backdrop-blur-2xl border border-white/50 p-6 md:p-12 rounded-[2rem] shadow-2xl relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12"
            >
                {/* Left Side: Form */}
                <div className="lg:overflow-y-auto lg:max-h-[80vh] lg:pr-2 custom-scrollbar">
                    <div className="mb-8">
                        {/* Logo Placeholder */}
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-12 h-12 bg-white rounded-xl shadow-lg shadow-teal-900/10 flex items-center justify-center overflow-hidden">
                                <img src="/logo.png" alt="Logo" className="w-10 h-10 object-contain" />
                            </div>
                            <span className="text-2xl font-black text-secondary tracking-tight">LifeLine<span className="text-primary">X</span></span>
                        </div>
                        <h2 className="text-4xl font-bold text-secondary mb-2">{t('register.title')}</h2>
                        <p className="text-slate-500">{t('register.subtitle')}</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Role Selection */}
                        <div>
                            <label className={labelClass}>{t('register.i_am')}</label>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                {['user', 'donor', 'hospital'].map((r) => (
                                    <div
                                        key={r}
                                        onClick={() => setFormData({ ...formData, role: r })}
                                        className={`cursor-pointer text-center py-3 rounded-xl border font-semibold capitalize transition-all flex flex-col items-center justify-center gap-1 ${formData.role === r
                                            ? 'bg-primary text-white border-primary shadow-lg shadow-primary/30 scale-105'
                                            : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50 hover:border-slate-300'}`}
                                    >
                                        {t(`register.role_${r}`)}
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div>
                                <label className={labelClass}>{t('register.full_name')}</label>
                                <input className={inputClass} placeholder="John Doe" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} required />
                            </div>
                            <div>
                                <label className={labelClass}>{t('register.phone')}</label>
                                <input className={inputClass} placeholder="+1 234 567 8900" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} required />
                            </div>
                        </div>

                        <div>
                            <label className={labelClass}>{t('register.email')}</label>
                            <input className={inputClass} type="email" placeholder="john@example.com" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} required />
                        </div>

                        <div>
                            <label className={labelClass}>{t('register.password')}</label>
                            <div className="relative">
                                <input className={inputClass} type="password" placeholder="••••••••" value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })} required />
                                <LockClosedIcon className="w-5 h-5 text-slate-400 absolute right-4 top-3.5" />
                            </div>
                        </div>

                        {/* Location Section */}
                        <div className="space-y-3 pt-2">
                            <div className="flex justify-between items-center">
                                <label className={labelClass}>{t('register.location_setup')}</label>
                                <button
                                    type="button"
                                    onClick={handleGetCurrentLocation}
                                    className="text-xs font-bold text-primary flex items-center gap-1 hover:underline"
                                >
                                    <MapPinIcon className="w-3 h-3" />
                                    {useCurrentLoc ? t('register.finding') : t('register.use_current_location')}
                                </button>
                            </div>

                            <div className="h-48 w-full rounded-2xl overflow-hidden border border-slate-200 shadow-inner relative z-0">
                                <MapContainer center={location} zoom={5} className="h-full w-full">
                                    <TileLayer url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png" attribution='&copy; OpenStreetMap' />
                                    <LocationPicker location={location} setLocation={setLocation} />
                                </MapContainer>
                            </div>
                            <p className="text-xs text-slate-400 text-center">{t('register.tap_map')}</p>
                        </div>

                        {/* Role Specific Fields */}
                        <AnimatePresence>
                            {formData.role === 'donor' && (
                                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                                    <div className="bg-primary/5 p-5 rounded-2xl border border-primary/10 mb-2">
                                        <label className={labelClass}>{t('register.blood_group')}</label>
                                        <select className={inputClass} value={formData.bloodGroup} onChange={e => setFormData({ ...formData, bloodGroup: e.target.value })} required>
                                            <option value="">{t('register.select_group')}</option>
                                            {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(bg => <option key={bg} value={bg}>{bg}</option>)}
                                        </select>
                                    </div>
                                </motion.div>
                            )}

                            {formData.role === 'hospital' && (
                                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                                    <div className="bg-primary/5 p-5 rounded-2xl border border-primary/10 mb-2 space-y-4">
                                        <div>
                                            <label className={labelClass}>{t('register.hospital_name')}</label>
                                            <input className={inputClass} value={formData.hospitalName} onChange={e => setFormData({ ...formData, hospitalName: e.target.value })} required />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className={labelClass}>{t('register.type')}</label>
                                                <select className={inputClass} value={formData.type} onChange={e => setFormData({ ...formData, type: e.target.value })}>
                                                    <option value="Hospital">Hospital</option>
                                                    <option value="BloodBank">Blood Bank</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label className={labelClass}>{t('register.city')}</label>
                                                <input className={inputClass} value={formData.address} onChange={e => setFormData({ ...formData, address: e.target.value })} required />
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <button type="submit" className="w-full bg-slate-900 border border-slate-800 text-white font-bold py-4 rounded-xl shadow-xl hover:bg-slate-800 transition-all transform hover:scale-[1.01] mt-6">
                            {t('register.submit')}
                        </button>
                    </form>
                </div>

                {/* Right Side: Visuals/Info */}
                <div className="hidden lg:flex flex-col justify-between bg-gradient-to-br from-primary to-primary-dark rounded-[2rem] p-10 text-white relative overflow-hidden">
                    {/* Abstract Circles */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/10 rounded-full blur-3xl -ml-16 -mb-16"></div>

                    <div className="relative z-10">
                        <h3 className="text-3xl font-bold mb-4">{t('register.why_join')}</h3>
                        <ul className="space-y-6">
                            {[
                                { title: t('register.rapid_response'), desc: t('register.rapid_desc') },
                                { title: t('register.blood_network'), desc: t('register.blood_desc') },
                                { title: t('register.secure_data'), desc: t('register.secure_desc') }
                            ].map((item, i) => (
                                <li key={i} className="flex items-start gap-4">
                                    <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center shrink-0">
                                        <CheckBadgeIcon className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-lg">{item.title}</h4>
                                        <p className="text-white/70 text-sm leading-relaxed">{item.desc}</p>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="mt-10 pt-10 border-t border-white/20 text-center relative z-10">
                        <Link to="/login" className="inline-block px-8 py-3 bg-white text-primary font-bold rounded-xl shadow-lg hover:bg-slate-50 transition-colors">
                            {t('register.have_account')}
                        </Link>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};
export default Register;

