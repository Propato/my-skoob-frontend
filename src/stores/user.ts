import { defineStore } from "pinia";
import { login } from "@/api";
import type { IUser } from "@/utils/interfaces";

export const useUserStore = defineStore("user", {
    state: () => ({
        user: null as IUser | null,
        token: null as string | null,
    }),

    getters: {
        isAuthenticated: (state): boolean => !!state.token,
    },

    actions: {
        async login(email: string, password: string) {
            const { token, user, errors } = await login({ email: email, password: password });
            this.user = user;
            this.token = token;

            return errors.length > 0 ? errors : true;
        },

        setUser(user: IUser) {
            this.user = user;
        },

        setUserState(token: string, user: IUser) {
            this.token = token;
            this.user = user;
        },

        logout() {
            this.user = null;
            this.token = null;
        },
    },
    persist: true,
});
