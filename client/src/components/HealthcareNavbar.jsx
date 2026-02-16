import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRightOnRectangleIcon } from '@heroicons/react/24/solid';
import AuthContext from '../context/AuthContext';
import LanguageSelector from './LanguageSelector';

const HealthcareNavbar = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    return (
        <header className="fixed top-0 w-full z-50 bg-white/70 backdrop-blur-md border-b border-white/50 shadow-sm transition-all">
            <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
                <Link to="/dashboard" className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white rounded-xl shadow-lg shadow-teal-900/10 flex items-center justify-center overflow-hidden">
                        <img src="/logo.png" alt="LifeLineX" className="w-8 h-8 object-contain" />
                    </div>
                    <span className="font-black text-2xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-slate-800 to-slate-600">
                        LifeLineX
                    </span>
                </Link>
                <div className="flex items-center gap-4 md:gap-6">
                    <LanguageSelector inline={true} />

                    <Link to="/profile" className="hidden md:block text-right hover:bg-slate-50 p-2 rounded-lg transition-colors">
                        <p className="text-sm font-bold text-slate-800">{user?.name}</p>
                        <p className="text-[10px] tracking-wider text-slate-500 uppercase font-bold">{user?.role}</p>
                    </Link>
                    {user?.profileImage && (
                        <Link to="/profile" className="p-0.5 rounded-full bg-gradient-to-br from-red-500 to-blue-500">
                            <img src={user.profileImage} alt="Profile" className="w-10 h-10 rounded-full border-2 border-white object-cover" />
                        </Link>
                    )}
                    <button onClick={logout} className="p-2 hover:bg-slate-100 rounded-full text-slate-500 hover:text-red-500 transition-colors">
                        <ArrowRightOnRectangleIcon className="w-6 h-6" />
                    </button>
                </div>
            </div>
        </header>
    );
};

export default HealthcareNavbar;
