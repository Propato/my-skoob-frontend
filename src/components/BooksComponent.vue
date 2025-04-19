<template>
    <div class="list-group">
        <template v-if="books.length > 0">
            <MessageComponent :messages="viewMessages" />
            <div v-for="book in books" :key="book.id">
                <div
                    v-if="book.id !== idLoading"
                    class="list-group-item list-group-item-action d-flex justify-content-between align-items-center"
                >
                    <div>
                        <h5 class="mb-1">
                            {{ book.title }}
                            <font-awesome-icon :icon="['fas', 'certificate']" class="fa-sm mx-2" v-if="book.validate" />
                        </h5>
                        <p class="mb-1">{{ book.author }}</p>
                        <small>{{ book.release_year }}</small>
                    </div>
                    <div>
                        <RouterLink class="btn" :to="`/reviews/register/${book.id}`">
                            <font-awesome-icon :icon="['fas', 'plus']" class="fa-lg text-light" />
                        </RouterLink>
                        <RouterLink class="btn" v-if="userStore.isAdmin" :to="`/books/edit/${book.id}`">
                            <font-awesome-icon :icon="['fas', 'pencil']" class="fa-md text-light" />
                        </RouterLink>
                        <button class="btn" v-if="userStore.isAdmin" @click="deleteBook(book)">
                            <font-awesome-icon :icon="['fas', 'xmark']" class="fa-xl text-danger" />
                        </button>
                    </div>
                </div>
                <div class="list-group-item list-group-item-action" v-else>
                    <div class="col">
                        <LoadingSpinnerComponent :loading="true" />
                    </div>
                </div>
            </div>
        </template>
        <div v-else class="list-group-item list-group-item-action text-center py-3">
            <p>No books registered. Why don't you start?</p>
            <RouterLink to="/books/register">
                <p class="nav-link">Add a book</p>
            </RouterLink>
        </div>
    </div>
</template>

<script setup lang="ts">
    import { ref, watch } from "vue";
    import { booksApi } from "@/api";
    import { useUserStore } from "@/stores/user";
    import type { IAlertMessage, IBook } from "@/utils/interfaces";

    import { MessageComponent, LoadingSpinnerComponent } from "@/components";

    const userStore = useUserStore();

    const props = defineProps<{
        books: IBook[];
    }>();

    const idLoading = ref(0);
    const viewMessages = ref<IAlertMessage[]>([]);

    const books = ref([...props.books]);

    watch(
        () => props.books,
        (newVal) => {
            books.value = [...newVal];
        },
    );

    const deleteBook = async (book: IBook) => {
        idLoading.value = book.id;
        viewMessages.value = [];

        const { errors } = await booksApi.deleteBook(book.id);
        if (errors.length === 0) {
            books.value = books.value.filter((value) => value.id !== book.id);
        }

        viewMessages.value = errors;
        idLoading.value = 0;
    };
</script>
