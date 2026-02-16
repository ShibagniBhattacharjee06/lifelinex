import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
    ArrowLeftIcon,
    TrophyIcon,
    StarIcon,
    UserGroupIcon,
    HeartIcon,
    GlobeAsiaAustraliaIcon,
    ShareIcon
} from '@heroicons/react/24/solid';
import HealthcareNavbar from '../components/HealthcareNavbar';

const Impact = () => {
    // Mock Data
    const leaderboard = [
        { id: 1, name: 'Rahul Sharma', score: 2450, badge: '🏆' },
        { id: 2, name: 'Priya Verma', score: 2100, badge: '🥈' },
        { id: 3, name: 'Amit Singh', score: 1850, badge: '🥉' },
        { id: 4, name: 'Sneha Gupta', score: 1600, badge: '⭐' },
        { id: 5, name: 'Vikram Das', score: 1450, badge: '⭐' },
    ];

    const challenges = [
        { id: 1, title: 'Blood Hero', desc: 'Donate blood once this month', xp: 500, users: 120, color: 'red' },
        { id: 2, title: 'First Responder', desc: 'Complete CPR training module', xp: 300, users: 45, color: 'blue' },
        { id: 3, title: 'Community Watch', desc: 'Verify 3 local AED locations', xp: 200, users: 89, color: 'green' }
    ];

    return (
        <div className="min-h-screen bg-slate-50 relative font-sans text-slate-800 pb-20 pt-24">
            <HealthcareNavbar />
            <div className="max-w-3xl mx-auto px-6 mb-6 flex items-center gap-4">
                <Link to="/dashboard" className="p-2 rounded-full hover:bg-slate-100 transition-colors">
                    <ArrowLeftIcon className="w-6 h-6 text-slate-600" />
                </Link>
                <h1 className="text-2xl font-black text-slate-800">Social Impact</h1>
            </div>

            <main className="max-w-3xl mx-auto p-6 space-y-8">

                {/* Impact Score Card */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-slate-900 rounded-[2.5rem] p-8 text-white shadow-2xl shadow-slate-900/40 relative overflow-hidden"
                >
                    <div className="relative z-10 text-center">
                        <p className="text-slate-400 font-bold uppercase tracking-widest text-sm mb-2">My Impact Score</p>
                        <div className="flex items-center justify-center gap-2 mb-4">
                            <StarIcon className="w-8 h-8 text-yellow-500 animate-pulse" />
                            <h2 className="text-6xl font-black bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-orange-500">
                                480
                            </h2>
                        </div>
                        <p className="text-slate-400 max-w-sm mx-auto text-sm">You are in the top <span className="text-white font-bold">15%</span> of contributors in your city!</p>

                        <div className="mt-8 flex justify-center gap-3">
                            <button className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 font-bold text-sm transition flex items-center gap-2">
                                <ShareIcon className="w-4 h-4" /> Share
                            </button>
                            <button className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 font-bold text-sm transition flex items-center gap-2 shadow-lg shadow-blue-600/30">
                                <GlobeAsiaAustraliaIcon className="w-4 h-4" /> Global Rank
                            </button>
                        </div>
                    </div>
                </motion.div>

                {/* Challenges */}
                <div>
                    <h3 className="text-xl font-black text-slate-800 mb-4 flex items-center gap-2">
                        <FireIconWrapper /> Active Challenges
                    </h3>
                    <div className="flex gap-4 overflow-x-auto pb-4 -mx-6 px-6 md:mx-0 md:px-0">
                        {challenges.map((challenge, i) => (
                            <motion.div
                                key={challenge.id}
                                initial={{ opacity: 0, x: 50 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.1 }}
                                className="min-w-[280px] bg-white p-5 rounded-3xl shadow-lg border border-slate-100 relative group overflow-hidden"
                            >
                                <div className={`absolute top-0 right-0 w-24 h-24 bg-${challenge.color}-500/10 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-150`}></div>

                                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-${challenge.color}-50 text-${challenge.color}-600 border border-${challenge.color}-100`}>
                                    +{challenge.xp} XP
                                </span>

                                <h4 className="font-bold text-lg mt-3 mb-1">{challenge.title}</h4>
                                <p className="text-sm text-slate-500 font-medium leading-relaxed mb-4">{challenge.desc}</p>

                                <div className="flex items-center justify-between mt-auto">
                                    <div className="flex -space-x-2">
                                        {[1, 2, 3].map(n => (
                                            <div key={n} className="w-8 h-8 rounded-full border-2 border-white bg-slate-200 flex items-center justify-center text-[10px] font-bold text-slate-500">
                                                U{n}
                                            </div>
                                        ))}
                                    </div>
                                    <button className="px-5 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition shadow-lg">
                                        Join
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Leaderboard */}
                <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden">
                    <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                        <h3 className="text-xl font-black text-slate-800 flex items-center gap-2">
                            <TrophyIcon className="w-6 h-6 text-yellow-500" /> Leaderboard
                        </h3>
                        <span className="text-xs font-bold text-slate-400 uppercase">This Week</span>
                    </div>

                    <div>
                        {leaderboard.map((user, index) => (
                            <div
                                key={user.id}
                                className={`flex items-center justify-between p-4 px-6 border-b border-slate-50 hover:bg-slate-50 transition ${index === 0 ? 'bg-yellow-50/30' : ''}`}
                            >
                                <div className="flex items-center gap-4">
                                    <span className={`w-8 font-black text-lg ${index < 3 ? 'text-slate-800' : 'text-slate-400'}`}>
                                        #{index + 1}
                                    </span>
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-slate-200 to-slate-300 flex items-center justify-center text-sm font-bold shadow-inner">
                                        {user.name[0]}
                                    </div>
                                    <div>
                                        <p className="font-bold text-slate-700">{user.name}</p>
                                        <p className="text-xs text-slate-400 font-bold">{user.badge} Super Contributor</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-lg font-black text-slate-800">{user.score}</p>
                                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Points</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="p-4 text-center">
                        <button className="text-sm font-bold text-blue-600 hover:text-blue-700">View Full Rankings</button>
                    </div>
                </div>

            </main>
        </div>
    );
};

const FireIconWrapper = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-orange-500">
        <path fillRule="evenodd" d="M12.963 2.286a.75.75 0 00-1.071-.136 9.742 9.742 0 00-3.539 6.177 7.547 7.547 0 01-1.705-1.715.75.75 0 00-1.152.082A9 9 0 1015.68 4.534a7.46 7.46 0 01-2.717-2.248zM15.75 14.25a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" clipRule="evenodd" />
    </svg>
);

export default Impact;
