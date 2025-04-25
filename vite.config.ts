import { fileURLToPath, URL } from "node:url";
import { defineConfig, loadEnv } from "vite";
import vue from "@vitejs/plugin-vue";
import vueDevTools from "vite-plugin-vue-devtools";

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, process.cwd(), "");
    const allowedHosts = env.VITE_APP_ALLOWED_HOSTS?.split(",") ?? [];

    console.log("allowedHosts: ", allowedHosts);

    return {
        plugins: [vue(), vueDevTools()],
        resolve: {
            alias: {
                "@": fileURLToPath(new URL("./src", import.meta.url)),
            },
        },
        server: {
            port: 3000,
            allowedHosts,
        },
    };
});
