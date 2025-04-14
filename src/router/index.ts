import { createRouter, createWebHistory } from "vue-router";
import { LoginView, RegisterView, HomeView, ProfileView, BooksView } from "@/views";
import { useUserStore } from "@/stores/user";
import { AuthLayout, DefaultLayout } from "@/layouts";

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: "/",
            component: DefaultLayout,
            children: [
                { path: "", name: "Home", component: HomeView },
                { path: "books", name: "Books", component: BooksView },
                {
                    path: "profile",
                    name: "Profile",
                    component: ProfileView,
                    meta: { requiresAuth: true },
                },
            ],
        },
        {
            path: "/",
            component: AuthLayout,
            children: [
                { path: "login", name: "Login", component: LoginView },
                { path: "register", name: "Register", component: RegisterView },
            ],
        },
    ],
});

router.beforeEach((to, from, next) => {
    const userStore = useUserStore();

    if (to.meta.requiresAuth && !userStore.isAuthenticated) {
        next("/login");
    } else {
        next();
    }
});

export default router;
