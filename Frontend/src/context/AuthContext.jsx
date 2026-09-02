import { createContext, useContext, useEffect, useState } from "react";
import {
    getCurrentUser,
    login as loginUser,
    register as registerUser,
    logout as logoutUser
} from "../services/auth.service";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const checkAuth = async () => {
        try {
            const data = await getCurrentUser();
            setUser(data.user);
        } catch (error) {
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        checkAuth();
    }, []);

    const login = async (email, password) => {
        const data = await loginUser(email, password);
        setUser(data.user);
        return data;
    };

    const register = async (name, email, password) => {
        const data = await registerUser(name, email, password);
        setUser(data.user);
        return data;
    };

    const logout = async () => {
        await logoutUser();
        setUser(null);
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                loading,
                login,
                register,
                logout
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};