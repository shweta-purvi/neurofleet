import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

const API_BASE_URL = 'http://localhost:8080/api/v1/auth';

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        const savedUser = localStorage.getItem('neuro_user');
        return savedUser ? JSON.parse(savedUser) : null;
    });

    const login = async (email, password) => {
        try {
            const response = await axios.post(`${API_BASE_URL}/authenticate`, { email, password });
            const userData = {
                email: email,
                fullName: response.data.fullName || 'User',
                role: response.data.role,
                token: response.data.token
            };
            setUser(userData);
            localStorage.setItem('neuro_user', JSON.stringify(userData));
            localStorage.setItem('neuro_token', userData.token);
            return userData;
        } catch (error) {
            console.error('Login failed:', error);
            throw error;
        }
    };

    const register = async (fullName, email, password, role) => {
        try {
            const response = await axios.post(`${API_BASE_URL}/register`, { fullName, email, password, role });
            const userData = {
                email: email,
                fullName: fullName,
                role: role,
                token: response.data.token
            };
            setUser(userData);
            localStorage.setItem('neuro_user', JSON.stringify(userData));
            localStorage.setItem('neuro_token', userData.token);
            return userData;
        } catch (error) {
            console.error('Registration failed:', error);
            throw error;
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('neuro_user');
        localStorage.removeItem('neuro_token');
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
