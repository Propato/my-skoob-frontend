<template>
    <div class="list-group">
        <template v-if="reviews.filter((value) => getFilter(value.status_display)).length > 0">
            <MessageComponent :messages="viewMessages" />
            <LoadingSpinnerComponent :loading="loading" />
            <div v-for="review in reviews.filter((value) => getFilter(value.status_display))" :key="review.id">
                <div v-if="review.id !== idLoading" class="list-group-item list-group-item-action">
                    <div class="row align-items-center">
                        <!-- Ícone de bookmark -->
                        <div
                            class="col-auto align-self-start"
                            style="margin-top: -0.5rem"
                            :class="{
                                'text-success': review.status_display === 'Read',
                                'text-warning': review.status_display === 'Reading',
                                'text-danger': review.status_display === 'Drop',
                                'text-info': review.status_display === 'List',
                            }"
                        >
                            <font-awesome-icon :icon="['fas', 'bookmark']" class="fa-3x" />
                        </div>

                        <!-- Conteúdo do review -->
                        <div class="col">
                            <h5 class="mb-1">
                                {{ review.book.title }}
                                <font-awesome-icon
                                    :icon="['fas', 'certificate']"
                                    class="fa-sm mx-2"
                                    v-if="review.book.validate"
                                />
                            </h5>
                            <p class="mb-1" v-if="review.stars">
                                <font-awesome-icon :icon="['fas', 'star']" class="text-warning" />
                                {{ review.stars }}/100
                            </p>
                            <small>{{ review.comment }}</small>
                        </div>

                        <!-- Botões de ação -->
                        <div class="col-auto d-flex">
                            <RouterLink class="btn" :to="`/reviews/edit/${review.id}`">
                                <font-awesome-icon :icon="['fas', 'pencil']" class="fa-md text-light" />
                            </RouterLink>
                            <button class="btn" @click="deleteReview(review.id)">
                                <font-awesome-icon :icon="['fas', 'xmark']" class="fa-xl text-danger" />
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Spinner de loading -->
                <div class="list-group-item list-group-item-action" v-if="idLoading !== 0">
                    <div class="col">
                        <LoadingSpinnerComponent :loading="true" />
                    </div>
                </div>
            </div>
        </template>

        <!-- Caso não existam reviews -->
        <div v-else class="list-group-item list-group-item-action text-center py-3">
            <p>No Reviews registered. Would you like to start?</p>
            <RouterLink to="/books">
                <p class="nav-link">Find a book</p>
            </RouterLink>
        </div>
    </div>
</template>

<script setup lang="ts">
    import { ref, watch } from "vue";
    import { reviewsApi } from "@/api";
    import { MessageComponent, LoadingSpinnerComponent } from "@/components";
    import type { IAlertMessage, IResponseReview } from "@/utils/interfaces";

    const props = defineProps<{
        reviews: IResponseReview[];
        filterStatus: Array<{ name: string; num: number; filter: boolean }>;
    }>();

    const loading = ref(false);
    const idLoading = ref(0);
    const viewMessages = ref<IAlertMessage[]>([]);
    const filters = ref<Array<{ name: string; num: number; filter: boolean }>>([...props.filterStatus]);

    const reviews = ref([...props.reviews]);

    watch(
        () => props.reviews,
        (newVal) => {
            loading.value = true;
            reviews.value = [...newVal];
            loading.value = false;
        },
    );
    watch(
        () => props.filterStatus,
        (newVal) => {
            loading.value = true;
            filters.value = [...newVal];
            loading.value = false;
        },
    );

    const getFilter = (status: string) => {
        const result = filters.value.filter(
            (value: { name: string; num: number; filter: boolean }) => value.name === status,
        );
        return result.length > 0 && result[0].filter;
    };

    const deleteReview = async (reviewId: number) => {
        idLoading.value = reviewId;
        viewMessages.value = [];
        loading.value = true;

        const { errors } = await reviewsApi.deleteReview(reviewId);
        if (errors.length === 0) {
            reviews.value = reviews.value.filter((value) => value.id !== reviewId);
        }

        viewMessages.value = errors;
        idLoading.value = 0;
        loading.value = false;
    };
</script>
