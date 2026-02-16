import React, { useState, useEffect, useContext, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import {
    ArrowLeftIcon,
    BeakerIcon,
    MoonIcon,
    FaceSmileIcon,
    CheckCircleIcon,
    FireIcon,
    BookOpenIcon,
    SunIcon
} from '@heroicons/react/24/solid';
import HealthcareNavbar from '../components/HealthcareNavbar';
import debounce from 'lodash.debounce';

const Lifestyle = () => {
    const { user } = useContext(AuthContext);
    const [loading, setLoading] = useState(true);
    const [waterCount, setWaterCount] = useState(0);
    const [sleepHours, setSleepHours] = useState(7);
    const [mood, setMood] = useState('neutral');
    const [habits, setHabits] = useState({
        exercise: false,
        meditate: false,
        read: false,
        journal: false
    });

    // Fetch today's data on mount
    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('token');
                const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/api/lifestyle/today`, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                setWaterCount(data.water);
                setSleepHours(data.sleep);
                setMood(data.mood);
                setHabits(data.habits || {
                    exercise: false,
                    meditate: false,
                    read: false,
                    journal: false
                });
                setLoading(false);
            } catch (error) {
                console.error("Error fetching lifestyle data:", error);
                setLoading(false);
            }
        };

        if (user) fetchData();
    }, [user]);

    // Debounced update function
    const updateBackend = useCallback(
        debounce(async (updates) => {
            try {
                const token = localStorage.getItem('token');
                await axios.put(`${import.meta.env.VITE_API_URL}/api/lifestyle/update`, updates, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            } catch (error) {
                console.error("Error updating lifestyle data:", error);
            }
        }, 1000),
        []
    );

    const handleWaterChange = (newVal) => {
        const val = Math.max(0, newVal);
        setWaterCount(val);
        updateBackend({ water: val });
    };

    const handleSleepChange = (val) => {
        setSleepHours(val);
        updateBackend({ sleep: val });
    };

    const handleMoodChange = (val) => {
        setMood(val);
        updateBackend({ mood: val });
    };

    const toggleHabit = (habit) => {
        const newHabits = { ...habits, [habit]: !habits[habit] };
        setHabits(newHabits);
        updateBackend({ habits: newHabits });
    };

    const moodEmoji = {
        happy: '😊',
        neutral: '😐',
        sad: '😔',
        stressed: '😫',
        excited: '🤩'
    };

    if (loading) return <div className="text-center pt-40">Loading your wellness stack...</div>;

    return (
        <div className="min-h-screen bg-slate-50 relative font-sans text-slate-800 pb-20 pt-24 overflow-x-hidden">
            <HealthcareNavbar />
            <div className="max-w-3xl mx-auto px-6 mb-6 flex items-center gap-4">
                <Link to="/dashboard" className="p-2 rounded-full hover:bg-slate-100 transition-colors">
                    <ArrowLeftIcon className="w-6 h-6 text-slate-600" />
                </Link>
                <h1 className="text-2xl font-black text-slate-800">Daily Lifestyle</h1>
            </div>

            <main className="max-w-3xl mx-auto p-6 space-y-8">

                {/* Intro Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl p-8 text-white shadow-xl shadow-indigo-500/20 relative overflow-hidden"
                >
                    <div className="relative z-10">
                        <h2 className="text-3xl font-black mb-2">Your Wellness Stack</h2>
                        <p className="opacity-90 font-medium text-indigo-100">Track your vitals and build healthy habits every day.</p>

                        <div className="mt-8 flex gap-8">
                            <div>
                                <p className="text-indigo-200 text-xs font-bold uppercase tracking-wider">Streak</p>
                                <p className="text-4xl font-black">1 <span className="text-lg opacity-60">day</span></p>
                            </div>
                            <div>
                                <p className="text-indigo-200 text-xs font-bold uppercase tracking-wider">Completion</p>
                                <p className="text-4xl font-black">{Math.round((Object.values(habits).filter(Boolean).length / 4) * 100)}%</p>
                            </div>
                        </div>
                    </div>
                    {/* Decor */}
                    <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
                </motion.div>

                {/* Vitals Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Water Tracker */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.1 }}
                        className="bg-white p-6 rounded-3xl shadow-lg border border-slate-100"
                    >
                        <div className="flex items-center gap-3 mb-6">
                            <div className="bg-blue-100 p-2 rounded-xl text-blue-500">
                                <BeakerIcon className="w-6 h-6" />
                            </div>
                            <h3 className="font-bold text-lg">Hydration</h3>
                        </div>

                        <div className="flex items-center justify-between">
                            <button
                                onClick={() => handleWaterChange(waterCount - 1)}
                                className="w-10 h-10 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center font-bold text-xl text-slate-600 transition"
                            >-</button>
                            <div className="text-center">
                                <span className="text-4xl font-black text-blue-600">{waterCount}</span>
                                <p className="text-xs text-slate-400 font-bold uppercase">Glasses</p>
                            </div>
                            <button
                                onClick={() => handleWaterChange(waterCount + 1)}
                                className="w-10 h-10 rounded-full bg-blue-100 hover:bg-blue-200 flex items-center justify-center font-bold text-xl text-blue-600 transition"
                            >+</button>
                        </div>

                        <div className="mt-6 h-3 bg-slate-100 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-blue-500 transition-all duration-500"
                                style={{ width: `${Math.min(100, (waterCount / 8) * 100)}%` }}
                            ></div>
                        </div>
                        <p className="text-right text-xs font-bold text-slate-400 mt-2">Goal: 8</p>
                    </motion.div>

                    {/* Sleep Tracker */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2 }}
                        className="bg-white p-6 rounded-3xl shadow-lg border border-slate-100"
                    >
                        <div className="flex items-center gap-3 mb-6">
                            <div className="bg-indigo-100 p-2 rounded-xl text-indigo-500">
                                <MoonIcon className="w-6 h-6" />
                            </div>
                            <h3 className="font-bold text-lg">Sleep</h3>
                        </div>

                        <div className="text-center mb-6">
                            <span className="text-4xl font-black text-indigo-600">{sleepHours}</span>
                            <span className="text-lg font-bold text-slate-400"> hrs</span>
                        </div>

                        <input
                            type="range"
                            min="0"
                            max="12"
                            step="0.5"
                            value={sleepHours}
                            onChange={(e) => handleSleepChange(e.target.value)}
                            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                        />
                        <div className="flex justify-between mt-2 text-xs font-bold text-slate-400">
                            <span>0h</span>
                            <span>6h</span>
                            <span>12h</span>
                        </div>
                    </motion.div>
                </div>

                {/* Mood Tracker */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="bg-white p-6 rounded-3xl shadow-lg border border-slate-100"
                >
                    <div className="flex items-center gap-3 mb-6">
                        <div className="bg-yellow-100 p-2 rounded-xl text-yellow-600">
                            <FaceSmileIcon className="w-6 h-6" />
                        </div>
                        <h3 className="font-bold text-lg">Daily Mood</h3>
                    </div>

                    <div className="flex justify-between gap-2 overflow-x-auto pb-2">
                        {Object.entries(moodEmoji).map(([key, emoji]) => (
                            <button
                                key={key}
                                onClick={() => handleMoodChange(key)}
                                className={`flex flex-col items-center gap-2 p-4 rounded-2xl transition-all min-w-[80px] ${mood === key ? 'bg-yellow-50 border-2 border-yellow-400 scale-105' : 'bg-slate-50 border border-slate-100 hover:bg-slate-100'}`}
                            >
                                <span className="text-3xl">{emoji}</span>
                                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">{key}</span>
                            </button>
                        ))}
                    </div>
                </motion.div>

                {/* Habits Stack */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="bg-white p-6 rounded-3xl shadow-lg border border-slate-100"
                >
                    <div className="flex items-center gap-3 mb-6">
                        <div className="bg-green-100 p-2 rounded-xl text-green-600">
                            <CheckCircleIcon className="w-6 h-6" />
                        </div>
                        <h3 className="font-bold text-lg">Habits Stack</h3>
                    </div>

                    <div className="space-y-3">
                        {[
                            { id: 'exercise', label: '30m Exercise', icon: <FireIcon className="w-5 h-5 text-orange-500" /> },
                            { id: 'meditate', label: '10m Meditation', icon: <SunIcon className="w-5 h-5 text-yellow-500" /> },
                            { id: 'read', label: 'Read 10 Pages', icon: <BookOpenIcon className="w-5 h-5 text-blue-500" /> },
                            { id: 'journal', label: 'Gratitude Journal', icon: <PencilSquareIconWrapper /> }
                        ].map((item) => (
                            <div
                                key={item.id}
                                onClick={() => toggleHabit(item.id)}
                                className={`flex items-center justify-between p-4 rounded-xl cursor-pointer transition-all border-2 ${habits[item.id] ? 'bg-green-50 border-green-500' : 'bg-slate-50 border-transparent hover:bg-slate-100'}`}
                            >
                                <div className="flex items-center gap-4">
                                    <div className={`p-2 rounded-full ${habits[item.id] ? 'bg-white' : 'bg-white/50'}`}>
                                        {item.icon}
                                    </div>
                                    <span className={`font-bold ${habits[item.id] ? 'text-green-800' : 'text-slate-600'}`}>{item.label}</span>
                                </div>
                                {habits[item.id] && (
                                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
                                        <CheckCircleIcon className="w-6 h-6 text-green-600" />
                                    </motion.div>
                                )}
                            </div>
                        ))}
                    </div>
                </motion.div>

            </main>
        </div>
    );
};

// Helper for consistent icon usage
const PencilSquareIconWrapper = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-purple-500">
        <path d="M21.731 2.269a2.625 2.625 0 00-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 000-3.712zM19.513 8.199l-3.712-3.712-12.15 12.15a5.25 5.25 0 00-1.32 2.214l-.8 2.685a.75.75 0 00.933.933l2.685-.8a5.25 5.25 0 002.214-1.32L19.513 8.2z" />
    </svg>
);

export default Lifestyle;
