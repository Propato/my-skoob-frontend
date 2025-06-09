<template>
    <div class="d-flex my-4">
        <aside class="col-3 px-3">
            <div class="position-relative mb-3">
                <input
                    v-model="search"
                    type="text"
                    name="search"
                    id="search"
                    class="form-control pe-5"
                    placeholder="Search a book..."
                    @keydown.enter="handleSearch"
                />
                <label for="search" class="position-absolute top-50 end-0 translate-middle-y me-3">
                    <font-awesome-icon :icon="['fas', 'magnifying-glass']" @click="handleSearch" />
                </label>
            </div>

            <div class="d-grid gap-2 mb-4">
                <button class="btn btn-primary" @click="handleSearch">Search</button>
                <RouterLink to="/books/register" class="btn btn-success">Add a Book</RouterLink>
                <small
                    >Books with <font-awesome-icon :icon="['fas', 'certificate']" class="fa-sm mx-2" /> were validated
                    by an admin.</small
                >
            </div>
        </aside>

        <section class="col-9 px-3">
            <LoadingSpinnerComponent :loading="loading" />
            <MessageComponent :messages="viewMessages" />

            <BooksComponent :books="books" />
        </section>
    </div>
</template>

<script setup lang="ts">
    import { onMounted, ref } from "vue";

    import { booksApi } from "@/api";
    import type { IAlertMessage, IBook } from "@/utils/interfaces";
    import { MessageComponent, LoadingSpinnerComponent, BooksComponent } from "@/components";

    const loading = ref(false);
    const viewMessages = ref<IAlertMessage[]>([]);

    const search = ref("");

    const books = ref<IBook[]>([]);

    const handleSearch = async () => {
        loading.value = true;
        viewMessages.value = [];

        const result = await booksApi.searchBooks(search.value.trim());
        books.value = result.books;
        viewMessages.value = result.errors;

        loading.value = false;
    };

    onMounted(() => {
        handleSearch();
    });
</script>
