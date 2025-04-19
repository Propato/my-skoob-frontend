<template>
    <div class="container">
        <h2 class="text-center my-4 mt-5">
            {{ isEditMode ? `Edit ${title || "book"}` : "Add a book to our community!" }}
        </h2>

        <div class="row mb-4 justify-content-center" v-if="loading || viewMessages.length !== 0">
            <div class="col-9">
                <LoadingSpinnerComponent :loading="loading" />
                <MessageComponent :messages="viewMessages" />
            </div>
        </div>

        <form @submit.prevent="handleSubmit" novalidate>
            <!-- Title -->
            <div class="row mb-4 justify-content-center">
                <div class="col-lg-7">
                    <label for="title" class="form-label">Title *</label>
                    <input
                        id="title"
                        v-model="title"
                        type="text"
                        class="form-control"
                        placeholder="Title..."
                        required
                    />
                </div>
            </div>

            <div class="row mb-4 justify-content-center">
                <div class="col-lg-6">
                    <label for="author" class="form-label">Author *</label>
                    <input
                        id="author"
                        v-model="author"
                        type="text"
                        class="form-control"
                        placeholder="Author..."
                        required
                    />
                </div>
            </div>

            <div class="row mb-4 justify-content-center align-items-end">
                <div class="col-lg-2">
                    <label for="pages" class="form-label">Pages</label>
                    <input id="pages" v-model="pages" type="number" class="form-control" />
                </div>

                <div class="col-lg-2">
                    <label for="release_year" class="form-label">Release Year</label>
                    <input id="release_year" v-model="release_year" type="number" class="form-control" />
                </div>
            </div>
            <div v-if="userStore.isAdmin" class="row mb-4 justify-content-center ps-xl-3">
                <div class="col-lg-2 mt-3 ps-lg-5">
                    <input id="validate" v-model="validate" type="checkbox" class="form-check-input ml-2" />
                    <label for="validate" class="form-check-label">Validate</label>
                </div>
            </div>

            <div class="row mb-5 justify-content-center text-center">
                <div class="col-lg-8">
                    <label for="overview" class="form-label">Overview *</label>
                    <textarea
                        id="overview"
                        v-model="overview"
                        class="form-control"
                        placeholder="Overview..."
                        rows="3"
                    ></textarea>
                </div>
                <small class="pt-2">This book will be validated by an Admin soon.</small>
            </div>
            <div class="row justify-content-center mb-5">
                <div class="col-md-6 col-lg-4 d-grid">
                    <button type="submit" class="btn btn-success">{{ isEditMode ? "Save" : "Add" }}</button>
                </div>
                <div class="col-md-6 col-lg-4 d-grid">
                    <button type="reset" class="btn btn-danger" @click="router.back()">Cancel</button>
                </div>
            </div>
        </form>
    </div>
</template>

<script setup lang="ts">
    import { onMounted, ref } from "vue";
    import { useRoute, useRouter } from "vue-router";
    import { useUserStore } from "@/stores/user";

    import { MessageComponent, LoadingSpinnerComponent } from "@/components";

    import { booksApi } from "@/api";
    import { isValid } from "@/utils/functions";
    import type { IAlertMessage } from "@/utils/interfaces";

    const route = useRoute();
    const router = useRouter();
    const userStore = useUserStore();

    const bookId = Number(route.params.id as string | undefined);
    const isEditMode = !!bookId;

    const loading = ref(false);
    const viewMessages = ref<IAlertMessage[]>([]);

    const title = ref("");
    const overview = ref("");
    const author = ref("");
    const pages = ref<number | undefined>(undefined);
    const release_year = ref<number | undefined>(undefined);
    const validate = ref(false);

    const isValidFields = () => {
        if (!title.value || !overview.value || !author.value) {
            viewMessages.value.push({ text: "Elements with * are required", type: "warning" });
            return false;
        }

        if (!isValid.Text(title.value, 1, 120))
            viewMessages.value.push({ text: "Invalid Size Title", type: "warning" });
        if (!isValid.Text(overview.value, 1, 300))
            viewMessages.value.push({ text: "Invalid Size Overview", type: "warning" });
        if (!isValid.Text(author.value, 1, 80))
            viewMessages.value.push({ text: "Invalid Size Author", type: "warning" });
        if (pages.value && !isValid.Int(pages.value))
            viewMessages.value.push({ text: "Invalid Pages Number", type: "warning" });
        if (release_year.value && !isValid.Int(release_year.value, -100000, new Date().getFullYear()))
            viewMessages.value.push({ text: "Invalid Year: -100000 <> Today", type: "warning" });

        return viewMessages.value.length === 0;
    };

    const handleSubmit = async () => {
        loading.value = true;

        viewMessages.value = [];

        if (isValidFields()) {
            let response;
            if (isEditMode) {
                response = await booksApi.updateBook({
                    id: bookId,
                    title: title.value,
                    overview: overview.value,
                    author: author.value,
                    pages: pages.value,
                    release_year: release_year.value,
                    validate: validate.value,
                });
            } else {
                response = await booksApi.registerBook({
                    title: title.value,
                    overview: overview.value,
                    author: author.value,
                    pages: pages.value,
                    release_year: release_year.value,
                    validate: validate.value,
                });
            }

            const { book, errors } = response;

            if (book && errors.length === 0) {
                viewMessages.value = [
                    { text: `${book.title} was ${isEditMode ? "updated" : "added"}`, type: "success" },
                ];

                if (isEditMode) router.push("/books/");

                title.value = "";
                overview.value = "";
                author.value = "";
                pages.value = undefined;
                release_year.value = undefined;
                validate.value = false;
            } else {
                viewMessages.value = errors.length ? errors : [{ text: "System Error", type: "danger" }];
            }
        }
        loading.value = false;
    };

    onMounted(async () => {
        if (isEditMode) {
            loading.value = true;
            const { book, errors } = await booksApi.getBookById(bookId);
            if (book && errors.length === 0) {
                title.value = book.title;
                overview.value = book.overview;
                author.value = book.author;
                pages.value = book.pages;
                release_year.value = book.release_year;
                validate.value = book.validate || false;
            } else {
                viewMessages.value = errors.length ? errors : [{ text: "Book not found", type: "danger" }];
            }
            loading.value = false;
        }
    });
</script>
