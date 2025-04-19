<template>
    <div class="container p-5 col-10 col-lg-6 col-xl-6">
        <div class="text-center m-4">
            <img
                v-if="userStore.user?.profile_picture"
                :src="userStore.user?.profile_picture"
                alt="User"
                class="rounded-circle p-3"
                width="32"
                height="32"
            />
            <font-awesome-icon v-else :icon="['fas', 'circle-user']" size="3x" class="p-3" />
            <h3>{{ name }}</h3>
        </div>

        <LoadingSpinnerComponent :loading="loading" />
        <MessageComponent :messages="viewMessages" />

        <form @submit.prevent="handleSave" novalidate>
            <div class="row mb-3">
                <label for="name" class="form-label">Profile Name *</label>
                <input
                    id="name"
                    v-model="name"
                    type="text"
                    class="form-control"
                    placeholder="Profile name..."
                    required
                />
            </div>

            <div class="row mb-3">
                <label for="email" class="form-label">Email *</label>
                <input
                    id="email"
                    v-model="email"
                    type="email"
                    class="form-control"
                    placeholder="Your email..."
                    required
                />
            </div>

            <div class="row mb-4">
                <div>
                    <label for="birthday" class="form-label">Birthday</label>
                    <input id="birthday" v-model="birthday" type="date" class="form-control" required />
                </div>
                <div class="md-3">
                    <label for="gender" class="form-label mt-3">Gender</label>
                    <select id="gender" v-model="gender" class="form-control" required>
                        <option disabled value="">Select your gender...</option>
                        <option value="FC">Female Cis</option>
                        <option value="MC">Male Cis</option>
                        <option value="FT">Female Trans</option>
                        <option value="MT">Male Trans</option>
                        <option value="N">Non-Binary</option>
                        <option value="O">Others</option>
                    </select>
                </div>
            </div>

            <div class="row m-3 mt-5 justify-content-center">
                <div class="col-md-5 d-grid">
                    <button type="submit" class="btn btn-success p-2 mx-2">Save</button>
                </div>
                <div class="col-md-5 d-grid">
                    <button type="button" @click="reset" class="btn btn-danger p-2 mx-2">Reset</button>
                </div>
            </div>
        </form>
    </div>
</template>

<script setup lang="ts">
    import { ref } from "vue";
    import { useUserStore } from "@/stores/user";

    import { MessageComponent, LoadingSpinnerComponent } from "@/components";

    import { usersApi } from "@/api";
    import type { IAlertMessage, IGender } from "@/utils/interfaces";
    import { isValid } from "@/utils/functions";

    const userStore = useUserStore();

    const name = ref(userStore.user?.name || "");
    const email = ref(userStore.user?.email || "");
    const birthday = ref<Date | undefined>(userStore.user?.birthday || undefined);
    const gender = ref<IGender>(userStore.user?.gender || "");

    const loading = ref(false);
    const viewMessages = ref<IAlertMessage[]>([]);

    const isValidFields = () => {
        if (!email.value || !name.value) {
            viewMessages.value.push({ text: "Elements with * are required", type: "warning" });
            return false;
        }
        if (!isValid.Email(email.value)) {
            viewMessages.value.push({ text: "Invalid Email", type: "warning" });
        }
        if (!isValid.Text(name.value, 1, 60)) {
            viewMessages.value.push({ text: "Invalid Profile Name", type: "warning" });
        }
        return viewMessages.value.length === 0;
    };

    const handleSave = async () => {
        loading.value = true;

        viewMessages.value = [];
        email.value = email.value.trim();

        if (isValidFields()) {
            const { user, errors } = await usersApi.updateUser({
                email: email.value,
                name: name.value,
                birthday: birthday.value,
                gender: gender.value,
            });

            if (user && errors.length === 0) {
                userStore.setUser(user);
                viewMessages.value = [{ text: "User updated successfully", type: "success" }];
            } else {
                viewMessages.value = errors.length !== 0 ? errors : [{ text: "System Error", type: "danger" }];
            }
        }
        loading.value = false;
    };

    const reset = () => {
        name.value = userStore.user?.name || "";
        email.value = userStore.user?.email || "";
        birthday.value = userStore.user?.birthday || undefined;
        gender.value = userStore.user?.gender || "";
    };
</script>
