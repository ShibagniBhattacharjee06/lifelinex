import { useState, useContext } from 'react';
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
        <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
            {/* Abstract Background */}
            <div className="absolute -top-[30%] -left-[10%] w-[70%] h-[70%] bg-red-900/30 rounded-full blur-[100px] pointer-events-none"></div>
            <div className="absolute bottom-0 right-0 w-[50%] h-[50%] bg-blue-900/20 rounded-full blur-[100px] pointer-events-none"></div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-2xl shadow-2xl relative z-10"
            >
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-white mb-2">Welcome Back</h2>
                    <p className="text-slate-400">Access the emergency network</p>
                </div>

                {error && (
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="bg-red-500/20 border border-red-500/50 text-red-200 px-4 py-2 rounded-lg mb-6 text-sm flex items-center"
                    >
                        ⚠️ {error}
                    </motion.div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="relative">
                        <UserCircleIcon className="w-6 h-6 absolute left-3 top-3 text-slate-500" />
                        <input
                            type="email"
                            placeholder="Email Address"
                            className="w-full bg-slate-800/50 border border-slate-700 text-white rounded-xl py-3 pl-12 pr-4 focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all outline-none"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />
                    </div>
                    <div className="relative">
                        <LockClosedIcon className="w-6 h-6 absolute left-3 top-3 text-slate-500" />
                        <input
                            type="password"
                            placeholder="Password"
                            className="w-full bg-slate-800/50 border border-slate-700 text-white rounded-xl py-3 pl-12 pr-4 focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all outline-none"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        />
                    </div>

                    <button type="submit" className="w-full bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 text-white font-bold py-3 rounded-xl shadow-lg transition-all transform hover:scale-[1.02]">
                        Login
                    </button>
                </form>

                <p className="text-center text-slate-500 mt-6 text-sm">
                    Don't have an account? <Link to="/register" className="text-red-400 hover:text-red-300 font-semibold underline decoration-2 underline-offset-4">Register here</Link>
                </p>
            </motion.div>
        </div>
    );
};

export default Login;
