<template>
    <div class="card shadow w-25 p-5 mx-auto">
        <RouterLink class="text-center mb-4" to="/">
            <img src="@/assets/skoob-logo.webp" alt="Skoob Logo" height="60" />
        </RouterLink>

        <h3 class="text-center m-4">Login</h3>

        <LoadingSpinnerComponent :loading="loading" />

        <MessageComponent :messages="viewMessages" />

        <form @submit.prevent="handleLogin" novalidate>
            <div class="mb-3">
                <label for="email" class="form-label">Email</label>
                <input
                    v-model="email"
                    id="email"
                    type="email"
                    class="form-control"
                    placeholder="Your email..."
                    required
                />
            </div>

            <div class="mb-3">
                <label for="password" class="form-label">Password</label>
                <input
                    v-model="password"
                    id="password"
                    type="password"
                    class="form-control"
                    placeholder="Password..."
                    required
                />
            </div>

            <div class="d-grid mb-3 mt-4">
                <button type="submit" class="btn btn-primary">Login</button>
            </div>

            <div class="text-center">
                <a href="https://www.youtube.com/watch?v=dQw4w9WgXcQ">Forgot password?</a>
                <RouterLink to="/register" class="d-block mt-3">
                    Don't have an account? Register
                </RouterLink>
            </div>
        </form>
    </div>
</template>

<script setup lang="ts">
    import { ref } from "vue";
    import { useRouter } from "vue-router";
    import { useUserStore } from "@/stores/user";

    import { MessageComponent, LoadingSpinnerComponent } from "@/components";

    import type { IAlertMessage } from "@/utils/interfaces";
    import { isValidEmail, isValidPassword } from "@/utils/functions";

    const router = useRouter();
    const userStore = useUserStore();

    const email = ref("");
    const password = ref("");

    const loading = ref(false);
    const viewMessages = ref<IAlertMessage[]>([]);

    const isValidFields = (email: string, password: string) => {
        if (!isValidEmail(email)) {
            viewMessages.value.push({ text: "Invalid Email", type: "warning" });
        }
        if (!isValidPassword(password))
            viewMessages.value.push({ text: "Invalid Password", type: "warning" });

        return viewMessages.value.length === 0;
    };

    async function handleLogin() {
        loading.value = true;

        viewMessages.value = [];
        email.value = email.value.trim();

        if (isValidFields(email.value, password.value)) {
            const result = await userStore.login(email.value, password.value);

            if (result === true && userStore.isAuthenticated) {
                router.push("/");
            }
            viewMessages.value = Array.isArray(result)
                ? result
                : [{ text: "System Error", type: "danger" }];
        }
        email.value = "";
        password.value = "";
        loading.value = false;
    }
</script>
