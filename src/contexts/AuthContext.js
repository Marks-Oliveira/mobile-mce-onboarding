import React, { createContext, useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';

import api from '../services/api';

export const AuthContext = createContext({
    user: {},
    loading: false,
    signIn({ emailOrCpf, password }) {},
    signOut() {},
    updateUserData(id) {},
});

const AuthProvider = ({ children }) => {
    const [token, setToken] = useState("");
    const [user, setUser] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadStoragedData = async () => {
            const storagedToken = await AsyncStorage.getItem(
                "Mindeducation:token",
            );
        
            if (storagedToken) {
                api.defaults.headers.authorization = storagedToken;
                setToken(JSON.parse(storagedToken));
            };
        
            setLoading(false);
        };
        
        loadStoragedData();
    }, []);

    const signIn = useCallback(async ({ emailOrCpf, password }) => {
        const login = {
            emailOrCpf: emailOrCpf,
            password: password
        };

        const response = await api.post("/user/login", login);
    
        api.defaults.headers.authorization = response.data.accessToken;
    
        setToken(response.data.accessToken);

        try {
            await AsyncStorage.setItem (
                "Mindeducation:token",
                JSON.stringify(response.data.accessToken)
            );
        } catch {
            Toast.show({
                type: "error",
                position: "bottom",
                text1: "Erro",
                text2: "Não foi possivel salvar alguma informação, tente relogar no app.",
            });
        }
        
        return response.data.accessToken;    
    }, []);

    const signOut = useCallback(async () => {
        try {
            await AsyncStorage.removeItem("Mindeducation:token");
    
            setToken("");
        } catch {
            Toast.show({
                type:"error",
                position: "bottom",
                text1: "Erro",
                text2: "Não foi possível remover alguma informação",
            });
        }
    }, []);

    const updateUserData = useCallback(async (id) => {
        try {
            const config = {
                headers: {
                   Authorization: token
                } 
            };

            const response = await api.get("user/getUser", config);

            setUser(response.data.user);
            await AsyncStorage.setItem(
                "Mindeducation:user",
                JSON.stringify(response.data.user)
            );
        } catch (error) {
            Toast.show({
                type:"error",
                position: "bottom",
                text1: "Erro",
                text2: "Não foi possível atualizar alguma informação, tente relogar no app",
            });
        }
    }, []);

    return (
        <AuthContext.Provider
            value={{ 
                token, 
                user, setUser, 
                loading, 
                signIn, 
                signOut, 
                updateUserData }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;
