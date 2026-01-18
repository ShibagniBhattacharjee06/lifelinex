import { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const decoded = jwtDecode(token);
                // Optional: Check expiry
                const currentTime = Date.now() / 1000;
                if (decoded.exp < currentTime) {
                    logout();
                } else {
                    setUser({ ...decoded, token }); // Minimal info from token
                    // Ideally fetch full profile here
                    fetchProfile(token);
                }
            } catch (e) {
                logout();
            }
        }
        setLoading(false);
    }, []);

    const fetchProfile = async (token) => {
        try {
            const config = { headers: { Authorization: `Bearer ${token}` } };
            const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/api/auth/me`, config);
            setUser(prev => ({ ...prev, ...data })); // Merge new data with existing token/basic info
        } catch (error) {
            console.error("Error fetching profile", error);
        }
    };

    const login = async (email, password) => {
        const { data } = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/login`, { email, password });
        localStorage.setItem('token', data.token);
        setUser(data);
        return data;
    };

    const register = async (userData) => {
        const { data } = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/register`, userData);
        localStorage.setItem('token', data.token);
        setUser(data);
        return data;
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
    };

    const updateUserData = (newData) => {
        setUser(newData);
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout, loading, updateUserData }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
