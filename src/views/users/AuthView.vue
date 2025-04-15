<template>
    <!-- <div class="card shadow py-5 col-10 col-sm-10 col-md-8 col-lg-6 col-xl-4 mx-auto"> -->
    <div class="card shadow container p-5 col-10 col-lg-6 col-xl-5">
        <RouterLink class="text-center mb-2" to="/">
            <img src="@/assets/skoob-logo.webp" alt="Skoob Logo" height="60" />
        </RouterLink>

        <h2 class="text-center m-4">Login</h2>

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

            <div class="row mb-3 text-center justify-content-center">
                <button type="submit" class="btn btn-primary p-2 m-3 col-md-8 col-10">Login</button>

                <a href="https://www.youtube.com/watch?v=dQw4w9WgXcQ">Forgot password?</a>
                <RouterLink to="/register" class="d-block mt-3"> Don't have an account? Register </RouterLink>
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
    import { isValid } from "@/utils/functions";

    const router = useRouter();
    const userStore = useUserStore();

    const email = ref("");
    const password = ref("");

    const loading = ref(false);
    const viewMessages = ref<IAlertMessage[]>([]);

    const isValidFields = () => {
        if (!isValid.Email(email.value)) viewMessages.value.push({ text: "Invalid Email", type: "warning" });
        if (!isValid.Password(password.value)) viewMessages.value.push({ text: "Invalid Password", type: "warning" });

        return viewMessages.value.length === 0;
    };

    const handleLogin = async () => {
        loading.value = true;

        viewMessages.value = [];
        email.value = email.value.trim();

        if (isValidFields()) {
            const result = await userStore.login(email.value, password.value);

            if (result === true && userStore.isAuthenticated) {
                router.push("/");
            }
            viewMessages.value = Array.isArray(result) ? result : [{ text: "System Error", type: "danger" }];
        }
        email.value = "";
        password.value = "";
        loading.value = false;
    };
</script>
