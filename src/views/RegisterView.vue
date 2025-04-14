<template>
    <div class="card shadow w-50 p-5 mx-auto">
        <RouterLink class="text-center mb-4" to="/">
            <img src="@/assets/skoob-logo.webp" alt="Skoob Logo" height="60" />
        </RouterLink>

        <h3 class="text-center mb-4">Register</h3>

        <LoadingSpinnerComponent :loading="loading" />

        <MessageComponent :messages="viewMessages" />

        <form @submit.prevent="handleRegister" novalidate>
            <div class="mb-3">
                <label for="email" class="form-label">Email</label>
                <input
                    id="email"
                    v-model="email"
                    type="email"
                    class="form-control"
                    placeholder="Your email..."
                    required
                />
            </div>

            <div class="mb-3">
                <label for="name" class="form-label">Profile Name</label>
                <input
                    id="name"
                    v-model="name"
                    type="text"
                    class="form-control"
                    placeholder="Profile name..."
                    required
                />
            </div>

            <div class="mb-3">
                <label for="password" class="form-label">Password</label>
                <input
                    id="password"
                    v-model="password"
                    type="password"
                    class="form-control"
                    placeholder="Password..."
                    required
                />
            </div>

            <div class="mb-4">
                <label for="repeat_password" class="form-label">Repeat Password</label>
                <input
                    id="repeat_password"
                    v-model="repeatPassword"
                    type="password"
                    class="form-control"
                    placeholder="Repeat Password..."
                    required
                />
            </div>

            <div class="d-grid mb-3">
                <button type="submit" class="btn btn-success">Register</button>
            </div>

            <div class="text-center">
                <RouterLink to="/login">Already have an account? Login</RouterLink>
            </div>
        </form>
    </div>
</template>

<script setup lang="ts">
    import { ref } from "vue";
    import { useRouter } from "vue-router";
    import { useUserStore } from "../stores/user";

    import { MessageComponent, LoadingSpinnerComponent } from "@/components";

    import { userCrud } from "@/api";
    import type { IAlertMessage } from "@/utils/interfaces";
    import { isValidEmail, isValidPassword, isValidText } from "@/utils/functions/isValidField";

    const router = useRouter();
    const userStore = useUserStore();

    const name = ref("");
    const email = ref("");
    const password = ref("");
    const repeatPassword = ref("");

    const loading = ref(false);
    const viewMessages = ref<IAlertMessage[]>([]);

    const isValidFields = (
        email: string,
        name: string,
        password: string,
        repeatPassword: string,
    ) => {
        if (!isValidEmail(email)) {
            viewMessages.value.push({ text: "Invalid Email", type: "warning" });
        }
        if (!isValidText(name, 0, 60)) {
            viewMessages.value.push({ text: "Invalid Profile Name", type: "warning" });
        }
        if (password === repeatPassword) {
            if (!isValidPassword(password))
                viewMessages.value.push({ text: "Invalid Password", type: "warning" });
        } else {
            viewMessages.value.push({ text: "Passwords don't match", type: "warning" });
        }

        return viewMessages.value.length === 0;
    };

    const handleRegister = async () => {
        loading.value = true;

        viewMessages.value = [];
        email.value = email.value.trim();

        if (isValidFields(email.value, name.value, password.value, repeatPassword.value)) {
            const { token, user, errors } = await userCrud.registerUser({
                email: email.value,
                name: name.value,
                password: password.value,
            });

            if (token && user && errors.length === 0) {
                userStore.setUserState(token, user);
                router.push("/profile");
            }
            viewMessages.value = Array.isArray(errors)
                ? errors
                : [{ text: "System Error", type: "danger" }];
        }
        email.value = "";
        name.value = "";
        password.value = "";
        repeatPassword.value = "";
        loading.value = false;
    };
</script>
