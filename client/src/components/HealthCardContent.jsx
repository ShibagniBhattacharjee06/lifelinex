import React, { useState } from 'react';
import axios from 'axios';
import { XMarkIcon, PencilSquareIcon, CheckCircleIcon, PhoneIcon } from '@heroicons/react/24/solid';

const HealthCardContent = ({ user, close, updateUserData }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        name: user.name,
        profileImage: user.profileImage, // Add image to state
        age: user.age || '',
        bloodGroup: user.bloodGroup || user.extraData?.bloodGroup || '',
        medicalHistory: user.medicalHistory || '',
        emergencyContact: user.emergencyContact || ''
    });

    const handleSave = async () => {
        try {
            const token = localStorage.getItem('token');
            const { data } = await axios.put('http://localhost:5000/api/auth/update', formData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            updateUserData(data); // Update global context
            setIsEditing(false);
        } catch (error) {
            alert('Failed to update profile');
        }
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData({ ...formData, profileImage: reader.result }); // Base64 string
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="relative">
            <div className="h-32 bg-gradient-to-br from-blue-600 to-indigo-600 relative">
                <button onClick={close} className="absolute top-4 right-4 bg-white/20 p-2 rounded-full hover:bg-white/30 text-white transition z-10">
                    <XMarkIcon className="w-5 h-5" />
                </button>
                {!isEditing && (
                    <button onClick={() => setIsEditing(true)} className="absolute top-4 left-4 bg-white/20 p-2 rounded-full hover:bg-white/30 text-white transition z-10 flex gap-1 items-center px-3">
                        <PencilSquareIcon className="w-4 h-4" /> <span className="text-xs font-bold">Edit</span>
                    </button>
                )}
            </div>

            <div className="px-6 pb-6 text-center -mt-12 bg-white relative z-0">
                <div className="relative inline-block mx-auto mb-2">
                    <img src={isEditing && formData.profileImage ? formData.profileImage : user.profileImage} alt="Profile" className="w-24 h-24 rounded-full border-4 border-white shadow-md bg-white object-cover" />
                    {isEditing && (
                        <div className="absolute bottom-0 right-0 bg-slate-900 rounded-full p-1.5 cursor-pointer hover:bg-slate-700 transition">
                            <label htmlFor="file-upload" className="cursor-pointer">
                                <PencilSquareIcon className="w-4 h-4 text-white" />
                            </label>
                            <input id="file-upload" type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                        </div>
                    )}
                </div>

                {isEditing ? (
                    <div className="space-y-3 mt-4 text-left">
                        <div>
                            <label className="text-xs font-bold text-slate-400">Full Name</label>
                            <input className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm font-bold text-slate-800" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="text-xs font-bold text-slate-400">Age</label>
                                <input type="number" className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm font-bold text-slate-800" value={formData.age} onChange={e => setFormData({ ...formData, age: e.target.value })} />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-slate-400">Blood Group</label>
                                <select className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm font-bold text-slate-800" value={formData.bloodGroup} onChange={e => setFormData({ ...formData, bloodGroup: e.target.value })}>
                                    <option value="">Select</option>
                                    {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(bg => <option key={bg} value={bg}>{bg}</option>)}
                                </select>
                            </div>
                        </div>
                        <div>
                            <label className="text-xs font-bold text-slate-400">Medical Conditions / Allergies</label>
                            <textarea rows={2} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm font-bold text-slate-800" value={formData.medicalHistory} onChange={e => setFormData({ ...formData, medicalHistory: e.target.value })} placeholder="e.g. Diabetes, Penicillin Allergy" />
                        </div>
                        <div>
                            <label className="text-xs font-bold text-slate-400">Emergency Contact</label>
                            <input className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm font-bold text-slate-800" value={formData.emergencyContact} onChange={e => setFormData({ ...formData, emergencyContact: e.target.value })} />
                        </div>
                        <button onClick={handleSave} className="w-full bg-green-600 text-white font-bold py-2 rounded-lg shadow-lg shadow-green-600/20 hover:bg-green-700 flex justify-center items-center gap-2">
                            <CheckCircleIcon className="w-5 h-5" /> Save ID Card
                        </button>
                    </div>
                ) : (
                    <>
                        <h2 className="text-2xl font-bold text-slate-800 mt-1">{user.name}</h2>
                        <p className="text-slate-500 text-sm mb-4">ID: <span className="font-mono bg-slate-100 px-2 py-0.5 rounded text-slate-600">{user._id?.slice(-6).toUpperCase()}</span></p>

                        <div className="grid grid-cols-2 gap-3 mb-4">
                            <div className="bg-red-50 p-3 rounded-xl border border-red-100">
                                <p className="text-xs text-red-400 font-bold uppercase mb-1">Blood Group</p>
                                <p className="text-xl font-black text-red-600">{user.bloodGroup || 'N/A'}</p>
                            </div>
                            <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                                <p className="text-xs text-slate-400 font-bold uppercase mb-1">Age</p>
                                <p className="text-xl font-black text-slate-700">{user.age || '--'} yrs</p>
                            </div>
                        </div>

                        <div className="text-left space-y-3">
                            <div className="bg-yellow-50 p-3 rounded-xl border border-yellow-100">
                                <p className="text-xs text-yellow-600 font-bold uppercase mb-1">Medical Medical History</p>
                                <p className="text-sm font-semibold text-slate-700">{user.medicalHistory || 'No known conditions'}</p>
                            </div>
                            <div className="bg-blue-50 p-3 rounded-xl border border-blue-100 flex justify-between items-center">
                                <div>
                                    <p className="text-xs text-blue-500 font-bold uppercase">Emergency Contact</p>
                                    <p className="text-sm font-bold text-blue-900">{user.emergencyContact || '--'}</p>
                                </div>
                                <PhoneIcon className="w-5 h-5 text-blue-500" />
                            </div>
                        </div>
                    </>
                )}
            </div>
            {!isEditing && (
                <div className="bg-slate-50 px-6 py-4 border-t border-slate-100 text-center">
                    <p className="text-xs text-slate-400 font-medium">Valid Medical Identity • LifeLineX</p>
                </div>
            )}
        </div>
    );
};
export default HealthCardContent;
