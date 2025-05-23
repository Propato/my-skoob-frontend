<template>
    <div class="card shadow container p-5 col-10 col-lg-6 col-xl-6">
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
                <small>At least 8 digits; Upper and Lower Case; Special Caracteres and Number.</small>
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

            <div class="text-center d-grid">
                <button type="submit" class="btn btn-success">Register</button>
                <RouterLink to="/login" class="my-3">Already have an account? Login</RouterLink>
                <br />
                <RouterLink to="/">Back to Home</RouterLink>
            </div>
        </form>
    </div>
</template>

<script setup lang="ts">
    import { ref } from "vue";
    import { useRouter } from "vue-router";

    import { MessageComponent, LoadingSpinnerComponent } from "@/components";

    import { usersApi } from "@/api";
    import type { IAlertMessage } from "@/utils/interfaces";
    import { isValid } from "@/utils/functions";

    const router = useRouter();

    const name = ref("");
    const email = ref("");
    const password = ref("");
    const repeatPassword = ref("");

    const loading = ref(false);
    const viewMessages = ref<IAlertMessage[]>([]);

    const isValidFields = () => {
        if (!isValid.Email(email.value)) {
            viewMessages.value.push({ text: "Invalid Email", type: "warning" });
        }
        if (!isValid.Text(name.value, 0, 60)) {
            viewMessages.value.push({ text: "Invalid Profile Name", type: "warning" });
        }
        if (password.value === repeatPassword.value) {
            if (!isValid.Password(password.value))
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

        if (isValidFields()) {
            const { user, errors } = await usersApi.registerUser({
                email: email.value,
                name: name.value,
                password: password.value,
            });

            if (user && errors.length === 0) {
                router.push("/login");
            }
            viewMessages.value = errors.length ? errors : [{ text: "System Error", type: "danger" }];
        }
        email.value = "";
        name.value = "";
        password.value = "";
        repeatPassword.value = "";
        loading.value = false;
    };
</script>
