import type { IUser } from "@/utils/interfaces";
import axios from "axios";

const isLocalhost = ["localhost", "127.0.0.1"].includes(window.location.hostname);

const BACKEND_URL = isLocalhost
    ? `http://localhost:${import.meta.env.VITE_APP_BACKEND_PORT}`
    : import.meta.env.VITE_APP_BACKEND_URL;

const TIMEOUT = Number(import.meta.env.VITE_APP_BACK_END_TIMEOUT) || 10000;

if (!BACKEND_URL) {
    throw new Error("BACKEND_URL não está definida corretamente.");
}

const instance = axios.create({
    baseURL: BACKEND_URL,
    timeout: TIMEOUT,
});

instance.interceptors.request.use((config) => {
    const { token }: { user: IUser; token: string } = JSON.parse(localStorage.getItem("user") || "");
    if (token) {
        config.headers.Authorization = `Token ${token}`;
    }
    return config;
});

export default instance;
