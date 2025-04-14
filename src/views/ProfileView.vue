<template>
    <div class="w-50 p-5 mx-auto">
        <div class="text-center mb-4">
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
                <label for="birthday" class="form-label">Birthday</label>
                <input id="birthday" v-model="birthday" type="date" class="form-control" required />
            </div>

            <div class="mb-3">
                <label for="gender" class="form-label">Gender</label>
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

            <div class="d-flex justify-content-center align-items-center p-3">
                <button type="submit" class="btn btn-success p-2 mx-2 px-5">
                    <h5 class="m-0">Save</h5>
                </button>
                <button type="button" @click="reset" class="btn btn-danger p-2 mx-2 px-5">
                    <h5 class="m-0">Cancel</h5>
                </button>
            </div>
        </form>
    </div>
</template>

<script setup lang="ts">
    import { ref } from "vue";
    import { useUserStore } from "@/stores/user";

    import { MessageComponent, LoadingSpinnerComponent } from "@/components";

    import { userCrud } from "@/api";
    import type { IAlertMessage, IGender } from "@/utils/interfaces";
    import { isValidEmail, isValidText } from "@/utils/functions";

    const userStore = useUserStore();

    const name = ref(userStore.user?.name || "");
    const email = ref(userStore.user?.email || "");
    const birthday = ref<Date | null>(userStore.user?.birthday || null);
    const gender = ref<IGender>(userStore.user?.gender || "");

    const loading = ref(false);
    const viewMessages = ref<IAlertMessage[]>([]);

    const isValidFields = (email: string, name: string) => {
        if (!isValidEmail(email)) {
            viewMessages.value.push({ text: "Invalid Email", type: "warning" });
        }
        if (!isValidText(name, 0, 60)) {
            viewMessages.value.push({ text: "Invalid Profile Name", type: "warning" });
        }
        return viewMessages.value.length === 0;
    };

    const handleSave = async () => {
        loading.value = true;

        viewMessages.value = [];
        email.value = email.value.trim();

        if (isValidFields(email.value, name.value)) {
            const { user, errors } = await userCrud.updateUser({
                email: email.value,
                name: name.value,
                birthday: birthday.value,
                gender: gender.value,
            });

            if (user && errors.length === 0) {
                userStore.setUser(user);
                viewMessages.value = [{ text: "User updated successfully", type: "success" }];
            } else {
                viewMessages.value =
                    errors.length !== 0 ? errors : [{ text: "System Error", type: "danger" }];
            }
        }
        loading.value = false;
    };

    const reset = () => {
        name.value = userStore.user?.name || "";
        email.value = userStore.user?.email || "";
        birthday.value = userStore.user?.birthday || null;
        gender.value = userStore.user?.gender || "";
    };
</script>
