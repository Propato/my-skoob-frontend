<template>
    <header>
        <nav
            class="p-3 navbar navbar-expand-lg navbar-light bg-primary-subtle text-primary-emphasis"
        >
            <div class="container">
                <!-- Logo -->
                <RouterLink class="navbar-brand" to="/">
                    <img src="@/assets/skoob-logo.webp" alt="Skoob Logo" height="60" />
                </RouterLink>

                <!-- Toggler -->
                <button
                    class="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarNav"
                    aria-controls="navbarNav"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                >
                    <span class="navbar-toggler-icon"></span>
                </button>

                <!-- Conteúdo da navbar -->
                <div class="collapse navbar-collapse justify-content-center" id="navbarNav">
                    <!-- Links centralizados -->
                    <ul class="navbar-nav mx-auto d-lg-none">
                        <li class="nav-item">
                            <RouterLink class="nav-link" to="/">
                                <h3>Home</h3>
                            </RouterLink>
                        </li>
                        <li class="nav-item">
                            <RouterLink class="nav-link" to="/books">
                                <h3>Books</h3>
                            </RouterLink>
                        </li>

                        <!-- Itens extras do usuário (aparecem junto aos links em telas pequenas) -->
                        <template v-if="userStore.isAuthenticated">
                            <li class="nav-item">
                                <RouterLink class="nav-link" to="/profile">
                                    <h3>Profile</h3>
                                </RouterLink>
                            </li>
                            <li class="nav-item">
                                <RouterLink class="nav-link" to="/config">
                                    <h3>Config</h3>
                                </RouterLink>
                            </li>
                            <li class="nav-item">
                                <a class="nav-link" href="#" @click.prevent="logout">
                                    <h3>Logout</h3>
                                </a>
                            </li>
                        </template>

                        <template v-else>
                            <li class="nav-item">
                                <RouterLink class="nav-link" to="/login">
                                    <h3>Login</h3>
                                </RouterLink>
                            </li>
                            <li class="nav-item">
                                <RouterLink class="nav-link" to="/register">
                                    <h3>Register</h3>
                                </RouterLink>
                            </li>
                        </template>
                    </ul>

                    <!-- Opções do usuário (somente para telas grandes) -->
                    <ul
                        class="navbar-nav ms-auto d-none d-lg-flex justify-content-center align-items-center"
                    >
                        <li class="nav-item">
                            <RouterLink class="nav-link" to="/">
                                <h3>Home</h3>
                            </RouterLink>
                        </li>
                        <li class="nav-item">
                            <RouterLink class="nav-link" to="/books">
                                <h3>Books</h3>
                            </RouterLink>
                        </li>

                        <template v-if="userStore.isAuthenticated">
                            <li class="nav-item dropdown">
                                <a
                                    class="nav-link dropdown-toggle d-flex align-items-center"
                                    href="#"
                                    role="button"
                                    data-bs-toggle="dropdown"
                                    aria-expanded="false"
                                >
                                    <img
                                        v-if="userStore.user?.profile_picture"
                                        :src="userStore.user?.profile_picture"
                                        alt="User"
                                        class="rounded-circle"
                                        width="32"
                                        height="32"
                                    />
                                    <font-awesome-icon
                                        v-else
                                        :icon="['fas', 'circle-user']"
                                        size="3x"
                                        class="px-2"
                                    />
                                </a>
                                <ul class="dropdown-menu dropdown-menu-end">
                                    <li>
                                        <RouterLink class="dropdown-item" to="/profile">
                                            <h3>Profile</h3>
                                        </RouterLink>
                                    </li>
                                    <li>
                                        <RouterLink class="dropdown-item" to="/config">
                                            <h3>Config</h3>
                                        </RouterLink>
                                    </li>
                                    <li>
                                        <a class="dropdown-item" href="#" @click.prevent="logout">
                                            <h3>Logout</h3>
                                        </a>
                                    </li>
                                </ul>
                            </li>
                        </template>

                        <template v-else>
                            <li class="nav-item">
                                <RouterLink class="nav-link" to="/login">
                                    <h3>Login</h3>
                                </RouterLink>
                            </li>
                            <li class="nav-item">
                                <RouterLink class="nav-link" to="/register">
                                    <h3>Register</h3>
                                </RouterLink>
                            </li>
                        </template>
                    </ul>
                </div>
            </div>
        </nav>
    </header>
</template>

<script setup lang="ts">
    import { RouterLink, useRouter } from "vue-router";
    import { useUserStore } from "@/stores/user";

    const router = useRouter();
    const userStore = useUserStore();

    const logout = () => {
        userStore.logout();
        router.push("/");
    };
</script>

<style scoped>
    .navbar-nav .nav-link {
        cursor: pointer;
    }
    h3 {
        margin: 0;
    }
</style>
