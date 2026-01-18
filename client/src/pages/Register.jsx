import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { motion } from 'framer-motion';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '', email: '', password: '', phone: '', role: 'user',
        bloodGroup: '', hospitalName: '', type: 'Hospital', address: ''
    });
    const { register } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Keeping logic same, just updating UI
            const payload = {
                ...formData,
                location: [77.2090, 28.6139],
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

    const inputClass = "w-full bg-slate-800/50 border border-slate-700 text-white rounded-xl py-3 px-4 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none placeholder-slate-500";
    const labelClass = "block text-slate-400 text-sm font-semibold mb-2 ml-1";

    return (
        <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 py-12 relative overflow-hidden">
            {/* Decor */}
            <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-indigo-900/20 rounded-full blur-[120px] pointer-events-none"></div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-2xl bg-white/5 backdrop-blur-xl border border-white/10 p-8 md:p-10 rounded-3xl shadow-2xl relative z-10"
            >
                <h2 className="text-4xl font-black text-white mb-2 text-center">Join LifeLineX</h2>
                <p className="text-slate-400 text-center mb-10">Be part of the emergency response network</p>

                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                        <label className={labelClass}>Role</label>
                        <div className="grid grid-cols-3 gap-4">
                            {['user', 'donor', 'hospital'].map((r) => (
                                <div
                                    key={r}
                                    onClick={() => setFormData({ ...formData, role: r })}
                                    className={`cursor-pointer text-center py-3 rounded-xl border font-semibold capitalize transition-all ${formData.role === r ? 'bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-500/25' : 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-700'}`}
                                >
                                    {r}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className={labelClass}>Full Name</label>
                        <input className={inputClass} placeholder="John Doe" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} required />
                    </div>
                    <div>
                        <label className={labelClass}>Email Address</label>
                        <input className={inputClass} type="email" placeholder="john@example.com" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} required />
                    </div>
                    <div>
                        <label className={labelClass}>Password</label>
                        <input className={inputClass} type="password" placeholder="••••••••" value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })} required />
                    </div>
                    <div>
                        <label className={labelClass}>Phone Number</label>
                        <input className={inputClass} placeholder="9876543210" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} required />
                    </div>

                    {/* Conditional Fields Animation */}
                    {formData.role === 'donor' && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="md:col-span-2 bg-slate-800/50 p-6 rounded-2xl border border-dashed border-slate-600">
                            <label className={labelClass}>Blood Group</label>
                            <select className={inputClass} value={formData.bloodGroup} onChange={e => setFormData({ ...formData, bloodGroup: e.target.value })} required>
                                <option value="">Select Group</option>
                                {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(bg => <option key={bg} value={bg}>{bg}</option>)}
                            </select>
                        </motion.div>
                    )}

                    {formData.role === 'hospital' && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-800/50 p-6 rounded-2xl border border-dashed border-slate-600">
                            <div className="md:col-span-2">
                                <label className={labelClass}>{formData.type} Name</label>
                                <input className={inputClass} placeholder="City General Hospital" value={formData.hospitalName} onChange={e => setFormData({ ...formData, hospitalName: e.target.value })} required />
                            </div>
                            <div>
                                <label className={labelClass}>Facility Type</label>
                                <select className={inputClass} value={formData.type} onChange={e => setFormData({ ...formData, type: e.target.value })}>
                                    <option value="Hospital">Hospital</option>
                                    <option value="BloodBank">Blood Bank</option>
                                </select>
                            </div>
                            <div>
                                <label className={labelClass}>Address</label>
                                <input className={inputClass} placeholder="123 Emergency Lane" value={formData.address} onChange={e => setFormData({ ...formData, address: e.target.value })} required />
                            </div>
                        </motion.div>
                    )}

                    <div className="md:col-span-2 mt-4">
                        <button type="submit" className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold py-4 rounded-xl shadow-xl transition-all transform hover:scale-[1.01]">
                            Create Account
                        </button>
                    </div>
                </form>
                <p className="text-center text-slate-500 mt-6 text-sm">
                    Already have an account? <Link to="/login" className="text-blue-400 hover:text-blue-300 font-semibold">Login</Link>
                </p>
            </motion.div>
        </div>
    );
};

export default Register;
