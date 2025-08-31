import { createContext, useEffect, useState, useContext } from "react";
import { supabase } from "../../src/supabaseClient";

const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
    const [session, setSession] = useState(undefined);


    // sign up new user
    const signUpNewUser = async (email, password) => {
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


    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
        });

        supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
        });
    }, []);

    // sign 



    return (
        <AuthContext.Provider value={{ session, signUpNewUser }}>
            {children}
        </AuthContext.Provider>
    )
}

export const UserAuth = () => {
    return useContext(AuthContext);
}