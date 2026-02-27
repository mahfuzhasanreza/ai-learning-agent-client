import { createContext, useEffect, useState, useContext } from "react";
import * as authService from "../services/authService";

const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [refreshToken, setRefreshToken] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    // Check if user is already logged in on mount
    useEffect(() => {
        const savedToken = authService.getAuthToken();
        const savedRefreshToken = authService.getRefreshToken();
        const savedUser = authService.getCurrentUser();
        
        if (savedToken && savedUser) {
            setToken(savedToken);
            setRefreshToken(savedRefreshToken);
            setUser(savedUser);
        }
        setIsLoading(false);
    }, []);

    // Sign up new user
    const signUpNewUser = async (userData) => {
        try {
            const result = await authService.signUp(userData);

            if (result.success) {
                setToken(result.token);
                setUser(result.user || result.data.user || result.data);
                return { success: true, data: result.data };
            }

            return { success: false, error: result.error };
        } catch (error) {
            console.error("Error signing up:", error);
            return { success: false, error: error.message };
        }
    };

    // Sign in existing user
    const signInUser = async (email, password) => {
        try {
            const result = await authService.signIn({ email, password });

            if (result.success) {
                setToken(result.token);
                setRefreshToken(result.refreshToken);
                setUser(result.user);
                
                // Log authentication details
                console.log('🔐 Authentication Set in Context:');
                console.log('Access Token:', result.token);
                console.log('Refresh Token:', result.refreshToken);
                console.log('User:', result.user);
                
                return { success: true, data: result.data };
            }

            return { success: false, error: result.error };
        } catch (error) {
            console.error("Error signing in:", error);
            return { success: false, error: error.message };
        }
    };

    // Sign out
    const signOutUser = async () => {
        await authService.signOut();
        setToken(null);
        setRefreshToken(null);
        setUser(null);
    };

    // Get auth token
    const getToken = () => {
        return token || authService.getAuthToken();
    };

    // Check if authenticated
    const isAuthenticated = () => {
        return authService.isAuthenticated();
    };

    return (
        <AuthContext.Provider value={{ 
            user, 
            token,
            refreshToken,
            isLoading,
            signUpNewUser, 
            signInUser, 
            signOut: signOutUser,
            getToken,
            isAuthenticated
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const UserAuth = () => {
    return useContext(AuthContext);
};