import { useState, useContext, createContext } from "react";
import apiClient from "../api/client.js"
import { useMemo } from "react";

const AuthContext = createContext(null);

function decodeToken(token) {
    const payload = token.split('.')[1];
    return JSON.parse(atob(payload));
}

export function AuthProvider({ children }) {
    try {
        const [token, setToken] = useState(() => localStorage.getItem("medflow_authToken"));
        let user = useMemo(() => { return token ? decodeToken(token) : null; }, [token])
        async function login(username, password) {
            const params = new URLSearchParams();
            params.append("username", username);
            params.append("password", password);
            const response = await apiClient.post("/auth/token", params);
            localStorage.setItem("medflow_authToken", response.data.access_token);
            setToken(response.data.access_token);
        }
        function logout() {
            localStorage.removeItem("medflow_authToken");
            setToken(null);
        }
        const values = { token, user, login, logout, isAuthenticated: Boolean(token) };
        return (
            <AuthContext.Provider value={values}>
                {children}
            </AuthContext.Provider>
        );
    }
    catch (error) {
        console.log(error);
        throw error;
    }
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be wrapped in an AuthProvider tag")
    }
    return context;
}
