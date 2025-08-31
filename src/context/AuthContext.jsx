import { createContext, useEffect, useState, useContext } from "react";
import { supabase } from "../../src/supabaseClient";

const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
    const [session, setSession] = useState(undefined);


    // sign up
    const signUpNewUser = async () => {
        const { data, error } = await supabase.auth.signUp({
            email: email,
            password: password,
        });

        if(error) {
            console.log("Error signing up:", error.message);
            return { success: false, error };
        }

        return { success: true, data };
    };

    // sign in
    const signInUser = async ({email, password}) => {
        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email: email,
                password: password,
            });
            if (error) {
                console.log("Error signing in:", error.message);
                return { success: false, error: error.message };
            }
            console.log("User signed in:", data);
            return { success: true, data };
            
        }
        catch (error) {
            console.log("Error signing in:", error.message);
            return { success: false, error };
        }
    }

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
        });

        supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
        });
    }, []);

    // sign out
    const signOut = async () => {
        const { error } = await supabase.auth.signOut();
        if (error) {
            console.log("Error signing out:", error.message);
        }
    }

    return (
        <AuthContext.Provider value={{ session, signUpNewUser, signInUser, signOut }}>
            {children}
        </AuthContext.Provider>
    )
};

export const UserAuth = () => {
    return useContext(AuthContext);
}