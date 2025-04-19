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
                <!-- <RouterLink to="books/register" class="btn btn-success">Share a Review</RouterLink> -->
            </div>

            <div class="list-group">
                <template v-for="list in listItems" :key="list.id">
                    <div
                        class="list-group-item list-group-item-action d-flex justify-content-between text-black"
                        @click="
                            () => {
                                list.filter = !list.filter;
                            }
                        "
                        :class="{
                            'bg-success': list.name === 'Read',
                            'bg-warning': list.name === 'Reading',
                            'bg-danger': list.name === 'Drop',
                            'bg-info': list.name === 'List',
                        }"
                    >
                        <div>
                            <span>{{ list.name }}</span>
                            <font-awesome-icon v-if="list.filter" :icon="['fas', 'circle-check']" class="mx-3" />
                        </div>
                        <span>{{ list.num }}</span>
                    </div>
                </template>
            </div>
        </aside>

        <section class="col-9 px-3">
            <LoadingSpinnerComponent :loading="loading" />

            <MessageComponent :messages="viewMessages" />

            <ReviewsComponent :reviews="reviews" :filterStatus="listItems" />
        </section>
    </div>
</template>

<script setup lang="ts">
    import { onMounted, ref } from "vue";
    import { reviewsApi } from "@/api";
    import type { IAlertMessage, IResponseReview } from "@/utils/interfaces";
    import { MessageComponent, LoadingSpinnerComponent, ReviewsComponent } from "@/components";

    const loading = ref(false);
    const viewMessages = ref<IAlertMessage[]>([]);

    const search = ref("");

    const reviews = ref<IResponseReview[]>([]);

    const listItems = ref([
        { name: "Read", num: 0, filter: true },
        { name: "Reading", num: 0, filter: true },
        { name: "Drop", num: 0, filter: true },
        { name: "List", num: 0, filter: true },
    ]);

    const handleSearch = async () => {
        loading.value = true;
        viewMessages.value = [];

        const result = await reviewsApi.searchReviews(search.value.trim());
        reviews.value = result.reviews;
        viewMessages.value = result.errors;

        loading.value = false;
    };

    onMounted(async () => {
        await handleSearch();

        listItems.value.forEach((element) => {
            element.num = reviews.value.filter(
                (value: IResponseReview) => value.status_display === element.name,
            ).length;
        });
    });
</script>
