import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';

const data = [
    { name: 'Mon', active: 4, resolved: 2 },
    { name: 'Tue', active: 3, resolved: 5 },
    { name: 'Wed', active: 7, resolved: 6 },
    { name: 'Thu', active: 2, resolved: 8 },
    { name: 'Fri', active: 6, resolved: 4 },
    { name: 'Sat', active: 9, resolved: 7 },
    { name: 'Sun', active: 5, resolved: 9 },
];

const ChartComponent = () => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="w-full h-[300px] bg-white/50 backdrop-blur-sm border border-white/60 rounded-3xl p-6 shadow-xl"
        >
            <h3 className="text-lg font-bold text-slate-700 mb-6">Weekly Emergency Activity</h3>
            <div className="w-full h-full pb-6">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                        data={data}
                        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                    >
                        <defs>
                            <linearGradient id="colorActive" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#EF4444" stopOpacity={0.8} />
                                <stop offset="95%" stopColor="#EF4444" stopOpacity={0} />
                            </linearGradient>
                            <linearGradient id="colorResolved" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#10B981" stopOpacity={0.8} />
                                <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748B', fontSize: 12 }} />
                        <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748B', fontSize: 12 }} />
                        <Tooltip
                            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                        />
                        <Area type="monotone" dataKey="active" stroke="#EF4444" fillOpacity={1} fill="url(#colorActive)" strokeWidth={3} />
                        <Area type="monotone" dataKey="resolved" stroke="#10B981" fillOpacity={1} fill="url(#colorResolved)" strokeWidth={3} />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </motion.div>
    );
};

export default ChartComponent;
