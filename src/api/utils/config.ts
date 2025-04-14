import type { IUser } from "@/utils/interfaces";
import axios from "axios";

const BACKEND_URL = import.meta.env.VITE_APP_BACKEND_URL;
const TIMEOUT = Number(import.meta.env.VITE_APP_BACK_END_TIMEOUT) || 10000;

if (!BACKEND_URL) {
    throw new Error("Variável de ambiente BACKEND_URL não definida");
}

const instance = axios.create({
    baseURL: BACKEND_URL,
    timeout: TIMEOUT,
});

instance.interceptors.request.use((config) => {
    const { token }: { user: IUser; token: string } = JSON.parse(
        localStorage.getItem("user") || "",
    );
    if (token) {
        config.headers.Authorization = `Token ${token}`;
    }
    return config;
});

export default instance;
