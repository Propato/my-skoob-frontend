import { createRouter, createWebHistory } from "vue-router";
import { HomeView, UsersViews, BooksViews, ReviewsViews } from "@/views";
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
                { path: "profile", name: "Profile", component: UsersViews.ProfileView, meta: { requiresAuth: true } },
                { path: "books", name: "Books", component: BooksViews.PanelView },
                {
                    path: "books/register",
                    name: "Register Book",
                    component: BooksViews.RegisterView,
                    meta: { requiresAuth: true },
                },
                {
                    path: "books/edit/:id",
                    name: "Edit Book",
                    component: BooksViews.RegisterView,
                    props: true,
                    meta: { requiresAdmin: true },
                },
                { path: "reviews", name: "Reviews", component: ReviewsViews.PanelView, meta: { requiresAuth: true } },
                {
                    path: "reviews/register/:bookId",
                    name: "Register Review",
                    component: ReviewsViews.RegisterView,
                    meta: { requiresAuth: true },
                },
                {
                    path: "reviews/edit/:reviewId",
                    name: "Edit Review",
                    component: ReviewsViews.RegisterView,
                    meta: { requiresAuth: true },
                },
            ],
        },
        {
            path: "/",
            component: AuthLayout,
            children: [
                { path: "login", name: "Login", component: UsersViews.AuthView },
                { path: "register", name: "Register", component: UsersViews.RegisterView },
            ],
        },
    ],
});

router.beforeEach((to, from, next) => {
    const userStore = useUserStore();

    if ((to.meta.requiresAuth && !userStore.isAuthenticated) || (to.meta.requiresAdmin && !userStore.isAdmin)) {
        next("/login");
    } else {
        next();
    }
});

export default router;
