<template>
    <div class="d-flex mt-4">
        <aside class="col-3 px-3">
            <div class="position-relative mb-3">
                <input
                    type="text"
                    name="search"
                    id="search"
                    class="form-control pe-5"
                    placeholder="Search a book..."
                />
                <label for="search" class="position-absolute top-50 end-0 translate-middle-y me-3">
                    <font-awesome-icon :icon="['fas', 'magnifying-glass']" />
                </label>
            </div>

            <div class="d-grid gap-2 mb-4">
                <button class="btn btn-primary" @click="search">Search</button>
                <button class="btn btn-success">Share a Book</button>
            </div>

            <div v-if="userStore.isAuthenticated" class="list-group">
                <template v-for="list in listItems" :key="list.id">
                    <div
                        class="list-group-item list-group-item-action d-flex justify-content-between"
                        @click="
                            () => {
                                list.filter = !list.filter;
                            }
                        "
                    >
                        <div>
                            <span>{{ list.name }}</span>
                            <font-awesome-icon
                                v-if="list.filter"
                                :icon="['fas', 'check']"
                                class="text-success mx-3"
                            />
                        </div>
                        <span>{{ list.num }}</span>
                    </div>
                </template>
            </div>
        </aside>

        <section class="col-9 px-3">
            <LoadingSpinnerComponent :loading="loading" />

            <MessageComponent :messages="viewMessages" />

            <div class="list-group">
                <template v-for="book in books" :key="book.id">
                    <div
                        class="list-group-item list-group-item-action d-flex justify-content-between align-items-center"
                    >
                        <div>
                            <h5 class="mb-1">{{ book.title }}</h5>
                            <p class="mb-1">{{ book.author }}</p>
                            <small>{{ book.year }}</small>
                        </div>
                        <RouterLink to="`/review/${book.id}`">
                            <font-awesome-icon
                                :icon="['fas', 'plus']"
                                class="fa-lg p-3 text-light"
                            />
                        </RouterLink>
                    </div>
                </template>
            </div>
        </section>
    </div>
</template>

<script setup lang="ts">
    import { ref } from "vue";
    import { useUserStore } from "@/stores/user";

    import { MessageComponent, LoadingSpinnerComponent } from "@/components";

    import type { IAlertMessage } from "@/utils/interfaces";

    const userStore = useUserStore();

    const loading = ref(false);
    const viewMessages = ref<IAlertMessage[]>([]);

    const books = ref([
        { id: 1, title: "The Hobbit", author: "J.R.R. Tolkien", year: 1937 },
        { id: 2, title: "1984", author: "George Orwell", year: 1949 },
    ]);

    const listItems = ref([
        { name: "Read", num: 0, filter: false },
        { name: "Reading", num: 0, filter: true },
        { name: "Drop", num: 0, filter: false },
        { name: "List", num: 0, filter: true },
    ]);

    const search = () => {};
</script>
