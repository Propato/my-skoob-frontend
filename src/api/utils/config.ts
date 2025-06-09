import type { IUser } from "@/utils/interfaces";
import axios from "axios";


const BACKEND_URL = import.meta.env.VITE_APP_BACKEND_URL;

const TIMEOUT = Number(import.meta.env.VITE_APP_BACK_END_TIMEOUT) || 10000;

if (!BACKEND_URL) {
    throw new Error("BACKEND_URL não está definida corretamente.");
}

const instance = axios.create({
    baseURL: BACKEND_URL,
    timeout: TIMEOUT,
});

instance.interceptors.request.use((config) => {
    try {
        const stored = localStorage.getItem("user");
        if (stored) {
            const { token }: { user: IUser; token: string } = JSON.parse(stored);
            if (token) {
                config.headers.Authorization = `Token ${token}`;
            }
        }
    } catch (e) {
        console.warn("Erro ao ler token do localStorage:", e);
    }
    return config;
});

export default instance;
