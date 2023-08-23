import {createContext, useContext, useEffect, useState} from "react";
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import {ToastAndroid} from "react-native";

interface AuthProps{
    authState?: {token: string | null; authenticated:boolean | null};
    onRegister?:(email: string, password: string, username: string) => Promise<any>;
    onLogin?: (username: string, password: string) => Promise<any>;
    onLogout?: ()=> Promise<any>;
}

const TOKEN_KEY = 'my_jwt';
export const API_URL = 'https://5665-46-188-225-44.ngrok.io/users/';
const AuthContext = createContext<AuthProps>({});

export const useAuth = () => {
    return useContext(AuthContext);
};

export const AuthProvider = ({children}: any)=> {
    const  [authState, setAuthState] =useState<{
        token: string | null;
        authenticated: boolean | null;
    }>({
        token: null,
        authenticated: null
    });

    useEffect(()=>{
        const loadToken = async () => {
            const token = await SecureStore.getItemAsync(TOKEN_KEY);
            console.log("stored token", token);

            if(token){
                axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                setAuthState({
                    token: token,
                    authenticated: true
                });
            }
        };
    }, []);
    const register = async (email:string, password: string, username: string) => {

        try {
            const data = {
                username: username,
                email: email,
                password: password,
                appUserRoles: ["ROLE_ADMIN"] // Assuming you want to assign ROLE_ADMIN by default
            };
            return await axios.post(`${API_URL}signup`, data);
        }
        catch(e){
            return e;
        }
    }

    const login = async (username: string, password: string) => {
        try {
            const data = {
                username: username,
                password: password,
            };

            console.log("ENTERING REAL LOGIN");
            const response = await axios.post(`${API_URL}signin`, data, {
                headers: {
                    "Content-Type": "application/json",
                },
            });

            console.log("RESPONSE", response);

            if (response.status === 200) {
                setAuthState({
                    token: response.data.token,
                    authenticated: true,
                });

                axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;

                console.log("TOKEN", authState.token);
                await SecureStore.setItemAsync(TOKEN_KEY, response.data.token);

                return response.data;

            }
        } catch (error) {
            if(error.response.status===422) {
                return {error: true, msg: "Invalid username or password"};
            }
        }
    };

    const logout = async () => {
        await SecureStore.deleteItemAsync(TOKEN_KEY);

        axios.defaults.headers.common['Authorization'] = '';

        setAuthState({
            token: null,
            authenticated:false
        })
    }
    const value = {
        authState,
        onRegister: register,
        onLogin: login,
        onLogout: logout,
    };

    return <AuthContext.Provider value={value}>
        {children}
    </AuthContext.Provider>

}