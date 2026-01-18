import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { motion } from 'framer-motion';
import { UserCircleIcon, LockClosedIcon } from '@heroicons/react/24/outline';

const Login = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            await login(formData.email, formData.password);
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed. Please check your connection.');
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 relative overflow-hidden">
            {/* Premium Background */}
            <div className="absolute top-0 right-0 w-[60%] h-[60%] bg-primary-light/10 rounded-full blur-[120px] pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-[40%] h-[40%] bg-accent/5 rounded-full blur-[100px] pointer-events-none"></div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md bg-white/80 backdrop-blur-2xl border border-white/50 p-8 rounded-[2rem] shadow-2xl relative z-10"
            >
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-white rounded-2xl shadow-lg shadow-teal-900/10 flex items-center justify-center overflow-hidden mx-auto mb-4">
                        <img src="/logo.png" alt="AesculapHealth" className="w-12 h-12 object-contain" />
                    </div>
                    <h2 className="text-3xl font-black text-secondary mb-2">Welcome Back</h2>
                    <p className="text-slate-500 font-medium">Access the premier emergency network</p>
                </div>

                {error && (
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="bg-red-50 text-red-600 border border-red-100 px-4 py-3 rounded-xl mb-6 text-sm flex items-center font-bold"
                    >
                        ⚠️ {error}
                    </motion.div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="relative">
                        <UserCircleIcon className="w-6 h-6 absolute left-4 top-3.5 text-slate-400" />
                        <input
                            type="email"
                            placeholder="Email Address"
                            className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl py-3.5 pl-12 pr-4 focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none font-medium placeholder-slate-400"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />
                    </div>
                    <div className="relative">
                        <LockClosedIcon className="w-6 h-6 absolute left-4 top-3.5 text-slate-400" />
                        <input
                            type="password"
                            placeholder="Password"
                            className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl py-3.5 pl-12 pr-4 focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none font-medium placeholder-slate-400"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        />
                    </div>

                    <button type="submit" className="w-full bg-secondary hover:bg-slate-900 text-white font-bold py-4 rounded-xl shadow-xl shadow-slate-900/10 transition-all transform hover:scale-[1.02]">
                        Login to Account
                    </button>
                </form>

                <p className="text-center text-slate-500 mt-8 text-sm font-medium">
                    New to AesculapHealth? <Link to="/register" className="text-primary hover:text-primary-dark font-bold underline decoration-2 underline-offset-4">Create Account</Link>
                </p>
            </motion.div>
        </div>
    );
};

export default Login;
