import React, { useContext, useState, useEffect } from 'react';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import SocketContext from '../context/SocketContext';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { MapIcon, BellAlertIcon, ArrowRightOnRectangleIcon, HeartIcon, PhoneIcon, MapPinIcon, XMarkIcon, ChartBarIcon } from '@heroicons/react/24/solid';
import { Dialog } from '@headlessui/react';
import HealthCardContent from '../components/HealthCardContent';
import ChartComponent from '../components/ChartComponent';
import { useTranslation } from 'react-i18next';
import HealthcareNavbar from '../components/HealthcareNavbar';

const Dashboard = () => {
    const { t } = useTranslation();
    const { user, logout, updateUserData } = useContext(AuthContext);
    const { socket } = useContext(SocketContext);
    const navigate = useNavigate();
    const [sosList, setSosList] = useState([]);
    const [loadingSOS, setLoadingSOS] = useState(false);

    // UI State
    const [isHealthIdOpen, setIsHealthIdOpen] = useState(false);
    const [isSOSModalOpen, setIsSOSModalOpen] = useState(false);
    const [sosType, setSosType] = useState('accident');
    const [selectedBloodGroup, setSelectedBloodGroup] = useState('O+');

    if (!user) return <div className="h-screen flex items-center justify-center text-slate-500 font-bold text-xl">Loading LifeLineX...</div>;

    useEffect(() => {
        if (user && socket) {
            socket.on('new_sos', (data) => {
                setSosList(prev => [data, ...prev]);
            });

            // Listen for responses
            socket.on('sos_response', (data) => {
                alert(`🚑 HELP IS COMING!\nResponder: ${data.responder}`);
            });
        }
        return () => {
            if (socket) {
                socket.off('new_sos');
                socket.off('sos_response');
            }
        }
    }, [user, socket]);

    useEffect(() => {
        if (user && (user.role === 'hospital' || user.role === 'donor')) {
            fetchActiveSOS();
        }
    }, [user]);

    const fetchActiveSOS = async () => {
        try {
            const token = localStorage.getItem('token');
            const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/api/sos/active`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setSosList(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error(error);
        }
    }

    const handleSOSSubmit = async () => {
        setLoadingSOS(true);
        setIsSOSModalOpen(false); // Close modal

        if (!navigator.geolocation) {
            alert('Geolocation is not supported');
            return;
        }

        navigator.geolocation.getCurrentPosition(async (position) => {
            const { latitude, longitude } = position.coords;
            try {
                const token = localStorage.getItem('token');

                const payload = {
                    type: sosType,
                    description: sosType === 'blood_request' ? `Urgent Blood Needed: ${selectedBloodGroup}` : 'Critical Emergency',
                    latitude,
                    longitude,
                    bloodGroup: sosType === 'blood_request' ? selectedBloodGroup : null
                };

                await axios.post(`${import.meta.env.VITE_API_URL}/api/sos`, payload, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            } catch (error) {
                alert('Error sending SOS');
            } finally {
                setLoadingSOS(false);
            }
        }, () => {
            alert('Unable to retrieve location');
            setLoadingSOS(false);
        });
    };

    const handleRespond = async (sosId) => {
        try {
            const token = localStorage.getItem('token');
            await axios.put(`${import.meta.env.VITE_API_URL}/api/sos/${sosId}/respond`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert('Response Confirmed!');
            setSosList(prev => prev.filter(item => item._id !== sosId));
        } catch (error) {
            console.error(error);
            alert('Failed to respond');
        }
    };

    const handleDownloadReport = async (sosId) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/sos/${sosId}/report`, {
                headers: { Authorization: `Bearer ${token}` },
                responseType: 'blob',
            });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `Report-LifeLineX-${sosId}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            console.error(error);
            alert('Failed to download report');
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 relative font-sans text-slate-800 overflow-x-hidden">
            {/* Navbar */}
            <HealthcareNavbar />

            <main className="max-w-7xl mx-auto p-6 md:p-10 pt-28">
                {/* USER VIEW */}
                {user.role === 'user' && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-16">
                        <section className="text-center space-y-6">
                            <motion.h1
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                className="text-3xl md:text-6xl font-black text-slate-800 tracking-tight"
                            >
                                {t('emergency_center')}
                            </motion.h1>
                            <p className="text-slate-500 text-lg md:text-xl max-w-2xl mx-auto font-medium">
                                Fast response saves lives. Tap below to alert nearby responders instantly.
                            </p>
                        </section>

                        <div className="flex justify-center my-12 relative">
                            {/* Pulse Rings */}
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] md:w-[350px] md:h-[350px] bg-red-500/20 rounded-full animate-ping opacity-75"></div>
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] md:w-[500px] md:h-[500px] bg-red-500/10 rounded-full animate-pulse"></div>

                            <button
                                onClick={() => setIsSOSModalOpen(true)}
                                className="relative z-10 w-60 h-60 md:w-72 md:h-72 rounded-full flex flex-col items-center justify-center text-white
                                           bg-gradient-to-br from-red-500 to-red-700 shadow-[0_20px_60px_-10px_rgba(220,38,38,0.5)]
                                           transition-transform hover:scale-105 active:scale-95 group border-4 border-red-400/30"
                            >
                                <BellAlertIcon className="w-20 h-20 mb-4 animate-bounce group-hover:animate-none" />
                                <span className="font-black text-4xl tracking-widest">{t('sos_btn')}</span>
                                <span className="text-sm font-medium mt-2 opacity-90 tracking-wide uppercase">{t('tap_alert')}</span>
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                            <motion.div
                                whileHover={{ y: -8, shadow: '0 25px 50px -12px rgba(0, 0, 0, 0.1)' }}
                                onClick={() => navigate('/map')}
                                className="bg-white/60 backdrop-blur-sm p-8 rounded-3xl shadow-xl border border-white/50 cursor-pointer group transition-all"
                            >
                                <div className="bg-blue-50 w-14 h-14 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-blue-500 transition-colors duration-300">
                                    <MapIcon className="w-7 h-7 text-blue-600 group-hover:text-white transition-colors" />
                                </div>
                                <h3 className="text-2xl font-bold text-slate-800 mb-2">{t('nearby_resources')}</h3>
                                <p className="text-slate-500">View hospitals, ambulances, and blood banks near you.</p>
                            </motion.div>

                            <motion.div
                                onClick={() => setIsHealthIdOpen(true)}
                                whileHover={{ y: -8, shadow: '0 25px 50px -12px rgba(0, 0, 0, 0.1)' }}
                                className="bg-white/60 backdrop-blur-sm p-8 rounded-3xl shadow-xl border border-white/50 cursor-pointer group transition-all"
                            >
                                <div className="bg-green-50 w-14 h-14 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-green-500 transition-colors duration-300">
                                    <HeartIcon className="w-7 h-7 text-green-600 group-hover:text-white transition-colors" />
                                </div>
                                <h3 className="text-2xl font-bold text-slate-800 mb-2">{t('health_id')}</h3>
                                <p className="text-slate-500">Access and share your digital health profile instantly.</p>
                            </motion.div>

                            <motion.div
                                onClick={() => navigate('/lifestyle')}
                                whileHover={{ y: -8, shadow: '0 25px 50px -12px rgba(0, 0, 0, 0.1)' }}
                                className="bg-white/60 backdrop-blur-sm p-8 rounded-3xl shadow-xl border border-white/50 cursor-pointer group transition-all"
                            >
                                <div className="bg-purple-50 w-14 h-14 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-purple-500 transition-colors duration-300">
                                    <ChartBarIcon className="w-7 h-7 text-purple-600 group-hover:text-white transition-colors" />
                                </div>
                                <h3 className="text-2xl font-bold text-slate-800 mb-2">Daily Lifestyle</h3>
                                <p className="text-slate-500">Track habits, water, sleep, and mood daily.</p>
                            </motion.div>

                            <motion.div
                                onClick={() => navigate('/impact')}
                                whileHover={{ y: -8, shadow: '0 25px 50px -12px rgba(0, 0, 0, 0.1)' }}
                                className="bg-white/60 backdrop-blur-sm p-8 rounded-3xl shadow-xl border border-white/50 cursor-pointer group transition-all"
                            >
                                <div className="bg-yellow-50 w-14 h-14 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-yellow-500 transition-colors duration-300">
                                    <div className="w-7 h-7 text-yellow-600 group-hover:text-white transition-colors flex items-center justify-center font-black">★</div>
                                </div>
                                <h3 className="text-2xl font-bold text-slate-800 mb-2">Social Impact</h3>
                                <p className="text-slate-500">View your community score, challenges, and leaderboard.</p>
                            </motion.div>
                        </div>
                    </motion.div>
                )}

                {/* RESPONDER VIEW */}
                {(user.role === 'hospital' || user.role === 'donor') && (
                    <div className="space-y-8">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {/* Left Column: Stats & Profile */}
                            <div className="lg:col-span-1 space-y-6">
                                <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="bg-white p-6 rounded-3xl shadow-xl border border-slate-100">
                                    <h2 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                                        <div className="w-1 h-6 bg-red-500 rounded-full"></div>
                                        Quick Overview
                                    </h2>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="bg-slate-50 p-5 rounded-2xl text-center hover:bg-slate-100 transition-colors">
                                            <p className="text-3xl font-black text-blue-600">{sosList.length}</p>
                                            <p className="text-xs text-slate-500 font-bold uppercase mt-1">Active Alerts</p>
                                        </div>
                                        <div className="bg-slate-50 p-5 rounded-2xl text-center hover:bg-slate-100 transition-colors">
                                            <p className="text-3xl font-black text-green-600">0</p>
                                            <p className="text-xs text-slate-500 font-bold uppercase mt-1">Resolved</p>
                                        </div>
                                    </div>
                                </motion.div>

                                {/* New Chart Component */}
                                <ChartComponent />
                            </div>

                            {/* Right Column: Live Feed */}
                            <div className="lg:col-span-2">
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-3">
                                        <span className="relative flex h-4 w-4">
                                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                            <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500"></span>
                                        </span>
                                        Live Emergency Feed
                                    </h2>
                                </div>

                                <div className="space-y-5">
                                    <AnimatePresence>
                                        {sosList.length === 0 && (
                                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20 bg-white/50 rounded-3xl border border-dashed border-slate-300">
                                                <p className="text-slate-400 font-medium">No active emergencies in your area.</p>
                                            </motion.div>
                                        )}
                                        {sosList.map(item => (
                                            <motion.div
                                                key={item._id}
                                                initial={{ y: 20, opacity: 0 }}
                                                animate={{ y: 0, opacity: 1 }}
                                                exit={{ opacity: 0, scale: 0.95 }}
                                                className="bg-white p-6 md:p-8 rounded-3xl shadow-lg border border-slate-100 hover:shadow-2xl transition-all relative overflow-hidden group"
                                            >
                                                <div className={`absolute top-0 left-0 w-2 h-full ${item.bloodGroup ? 'bg-red-500' : 'bg-orange-500'}`}></div>

                                                <div className="flex flex-col lg:flex-row justify-between gap-6">
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-3 mb-4">
                                                            <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${item.bloodGroup ? 'bg-red-50 text-red-600 border border-red-100' : 'bg-orange-50 text-orange-600 border border-orange-100'}`}>
                                                                {item.bloodGroup ? `🩸 BLOOD REQ: ${item.bloodGroup}` : `🚑 ${item.type}`}
                                                            </span>
                                                            <span className="text-slate-400 text-xs font-semibold">{new Date(item.createdAt).toLocaleTimeString()}</span>
                                                        </div>

                                                        {/* Patient Info */}
                                                        <div className="flex items-center gap-4 mb-6">
                                                            {item.user?.profileImage ? (
                                                                <img src={item.user.profileImage} className="w-14 h-14 rounded-full border-2 border-white shadow-md" alt="Patient" />
                                                            ) : (
                                                                <div className="w-14 h-14 rounded-full bg-slate-200 flex items-center justify-center text-slate-500 font-bold text-xl">
                                                                    {item.user?.name?.[0]}
                                                                </div>
                                                            )}
                                                            <div>
                                                                <p className="text-xl font-bold text-slate-900">{item.user?.name || 'Unknown User'}</p>
                                                                <p className="text-sm text-slate-500 font-medium">{item.user?.phone || 'No Contact Info'}</p>
                                                            </div>
                                                        </div>

                                                        {/* Action Buttons */}
                                                        <div className="flex flex-wrap gap-3">
                                                            {item.user?.phone && (
                                                                <a href={`tel:${item.user.phone}`} className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-50 text-slate-700 font-bold text-sm hover:bg-slate-100 transition-colors">
                                                                    <PhoneIcon className="w-4 h-4" /> Call
                                                                </a>
                                                            )}
                                                            <a
                                                                href={`https://www.google.com/maps/dir/?api=1&destination=${item.location.coordinates[1]},${item.location.coordinates[0]}`}
                                                                target="_blank"
                                                                rel="noreferrer"
                                                                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-50 text-blue-600 font-bold text-sm hover:bg-blue-100 transition-colors"
                                                            >
                                                                <MapIcon className="w-4 h-4" /> Locate
                                                            </a>
                                                            <button
                                                                onClick={() => handleDownloadReport(item._id)}
                                                                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-800 text-white font-bold text-sm hover:bg-slate-900 transition-colors shadow-lg shadow-slate-900/10"
                                                            >
                                                                📄 Report
                                                            </button>
                                                        </div>
                                                    </div>

                                                    <button
                                                        onClick={() => handleRespond(item._id)}
                                                        className="self-start lg:self-center px-8 py-4 bg-gradient-to-r from-slate-900 to-slate-800 text-white rounded-2xl font-bold tracking-wide shadow-xl shadow-slate-900/20 hover:scale-105 active:scale-95 transition-all"
                                                    >
                                                        RESPOND NOW
                                                    </button>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </AnimatePresence>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </main>

            {/* HEALTH ID MODAL */}
            <Dialog open={isHealthIdOpen} onClose={() => setIsHealthIdOpen(false)} className="relative z-50">
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" aria-hidden="true" />
                <div className="fixed inset-0 flex items-center justify-center p-4">
                    <Dialog.Panel className="w-full max-w-sm rounded-[2rem] bg-white shadow-2xl overflow-hidden relative">
                        <HealthCardContent user={user} close={() => setIsHealthIdOpen(false)} updateUserData={updateUserData} />
                    </Dialog.Panel>
                </div>
            </Dialog>

            {/* SOS TYPE MODAL */}
            <Dialog open={isSOSModalOpen} onClose={() => setIsSOSModalOpen(false)} className="relative z-50">
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" aria-hidden="true" />
                <div className="fixed inset-0 flex items-center justify-center p-4">
                    <Dialog.Panel className="w-full max-w-lg rounded-[2.5rem] bg-white p-8 shadow-2xl relative overflow-hidden">
                        {/* Decor */}
                        <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/10 rounded-bl-full -mr-8 -mt-8"></div>

                        <Dialog.Title className="text-3xl font-black text-slate-900 mb-2">Emergency Type</Dialog.Title>
                        <Dialog.Description className="text-slate-500 font-medium text-lg mb-8">
                            Please specify the nature of your emergency.
                        </Dialog.Description>

                        <div className="space-y-4">
                            <motion.div whileTap={{ scale: 0.98 }} onClick={() => setSosType('accident')} className={`p-6 rounded-2xl border-2 cursor-pointer transition-all flex items-center gap-5 ${sosType === 'accident' ? 'border-red-500 bg-red-50 ring-4 ring-red-500/10' : 'border-slate-100 hover:border-red-200 hover:bg-slate-50'}`}>
                                <div className="bg-red-100 p-4 rounded-full text-red-600"><BellAlertIcon className="w-8 h-8" /></div>
                                <div>
                                    <h3 className="text-xl font-bold text-slate-800">General Emergency</h3>
                                    <p className="text-sm text-slate-500 font-medium">Accident, Fire, Police needed</p>
                                </div>
                            </motion.div>

                            <motion.div whileTap={{ scale: 0.98 }} onClick={() => setSosType('blood_request')} className={`p-6 rounded-2xl border-2 cursor-pointer transition-all flex items-center gap-5 ${sosType === 'blood_request' ? 'border-red-500 bg-red-50 ring-4 ring-red-500/10' : 'border-slate-100 hover:border-red-200 hover:bg-slate-50'}`}>
                                <div className="bg-red-100 p-4 rounded-full text-red-600"><HeartIcon className="w-8 h-8" /></div>
                                <div>
                                    <h3 className="text-xl font-bold text-slate-800">Blood Request</h3>
                                    <p className="text-sm text-slate-500 font-medium">Urgent blood needed at location</p>
                                </div>
                            </motion.div>

                            <AnimatePresence>
                                {sosType === 'blood_request' && (
                                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} className="overflow-hidden pt-2">
                                        <label className="block text-sm font-bold text-slate-700 mb-3 ml-1">Select Blood Group</label>
                                        <div className="grid grid-cols-4 gap-3">
                                            {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(bg => (
                                                <div
                                                    key={bg}
                                                    onClick={() => setSelectedBloodGroup(bg)}
                                                    className={`text-center py-3 rounded-xl font-bold text-sm cursor-pointer transition-all ${selectedBloodGroup === bg ? 'bg-red-600 text-white shadow-lg shadow-red-500/30' : 'bg-slate-50 text-slate-600 hover:bg-slate-100'}`}
                                                >
                                                    {bg}
                                                </div>
                                            ))}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        <div className="mt-10 flex gap-4">
                            <button onClick={() => setIsSOSModalOpen(false)} className="flex-1 py-4 rounded-xl font-bold text-slate-600 hover:bg-slate-50 transition-colors">Cancel</button>
                            <button onClick={handleSOSSubmit} className="flex-1 py-4 rounded-xl font-bold text-white bg-red-600 hover:bg-red-700 shadow-xl shadow-red-500/30 hover:scale-105 active:scale-95 transition-all">
                                {sosType === 'blood_request' ? 'REQUEST BLOOD' : 'SEND ALERT'}
                            </button>
                        </div>
                    </Dialog.Panel>
                </div>
            </Dialog>
        </div>
    );
};

export default Dashboard;
