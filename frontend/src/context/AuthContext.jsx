import React, { createContext, useState, useContext } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState({ userId: 1 }); 
    const [showReport, setShowReport] = useState(null);

    const login = (userId) => setUser({ userId });
    const logout = () => setUser(null);

    return (
        <AuthContext.Provider value={{ user, login, logout ,showReport, setShowReport}}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);