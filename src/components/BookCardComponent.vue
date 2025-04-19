<template>
    <div class="list-group">
        <MessageComponent :messages="viewMessages" />
        <template v-if="book && !loading">
            <div class="card shadow-sm mb-3">
                <div class="card-body">
                    <h5 class="card-title d-flex align-items-center">
                        {{ book.title }}
                        <font-awesome-icon :icon="['fas', 'certificate']" class="fa-sm mx-2" v-if="book.validate" />
                    </h5>
                    <h6 class="card-subtitle mb-2 text-muted">Author: {{ book.author }}</h6>
                    <p class="card-text">
                        <small class="d-block">Year: {{ book.release_year || "----" }}</small>
                        <small class="d-block mb-2">Pages: {{ book.pages || "--" }}</small>
                        {{ book.overview }}
                    </p>
                </div>
            </div>
        </template>
        <div v-else class="card shadow-sm mb-3">
            <div class="card-body d-flex justify-content-center">
                <LoadingSpinnerComponent :loading="loading" />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
    import { onMounted, ref, watch } from "vue";
    import { booksApi } from "@/api";
    import type { IAlertMessage, IBook } from "@/utils/interfaces";
    import { MessageComponent, LoadingSpinnerComponent } from "@/components";

    const props = defineProps<{
        bookId: number;
    }>();

    const loading = ref(false);
    const viewMessages = ref<IAlertMessage[]>([]);

    const book = ref<IBook | null>(null);

    watch(
        () => props.bookId,
        (newId) => {
            handleBook(newId);
        },
    );

    const handleBook = async (id: number) => {
        loading.value = true;
        viewMessages.value = [];

        const result = await booksApi.getBookById(id);

        book.value = result.book;
        viewMessages.value = result.errors;

        loading.value = false;
    };

    onMounted(async () => {
        if (props.bookId) {
            handleBook(props.bookId);
        }
    });
</script>
