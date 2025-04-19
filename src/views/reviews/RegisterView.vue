<template>
    <div class="container">
        <h2 class="text-center my-4 mt-5">
            {{ isEditMode ? `Edit ${title || "book"}'s Review` : "Share a Review in our community!" }}
        </h2>

        <div class="row mb-4 justify-content-center" v-if="loading || viewMessages.length !== 0">
            <div class="col-9">
                <LoadingSpinnerComponent :loading="loading" />
                <MessageComponent :messages="viewMessages" />
            </div>
        </div>

        <BookCardComponent :bookId="bookId" />

        <form @submit.prevent="handleSubmit" novalidate>
            <div class="row mb-4 justify-content-center">
                <div class="col-lg-4">
                    <label for="status" class="form-label mt-3">Add To *</label>
                    <select id="status" v-model="status" class="form-control" required>
                        <option disabled value="">Select book status...</option>
                        <option value="0">Read</option>
                        <option value="1">Reading</option>
                        <option value="2">Drop</option>
                        <option value="3">My List</option>
                    </select>
                </div>
            </div>

            <div class="row mb-4 justify-content-center">
                <div class="col-lg-4">
                    <label for="stars" class="form-label">Stars</label>
                    <input
                        id="stars"
                        v-model="stars"
                        type="Number"
                        class="form-control"
                        placeholder="0 ... 10,0"
                        required
                    />
                </div>
            </div>

            <div class="row mb-5 justify-content-center">
                <div class="col-lg-8">
                    <label for="comment" class="form-label">Comments</label>
                    <textarea
                        id="comment"
                        v-model="comment"
                        class="form-control"
                        placeholder="My Comments..."
                        rows="3"
                    ></textarea>
                </div>
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
    import { reviewsApi } from "@/api";
    import { onMounted, ref } from "vue";
    import { isValid } from "@/utils/functions";
    import { useRoute, useRouter } from "vue-router";
    import { statusMap, type IAlertMessage, type IReviewStatus } from "@/utils/interfaces";
    import { MessageComponent, LoadingSpinnerComponent, BookCardComponent } from "@/components";

    const route = useRoute();
    const router = useRouter();

    const bookId = ref(Number(route.params.bookId as string | undefined));
    const reviewId = Number(route.params.reviewId as string | undefined);
    const isEditMode = !!reviewId;

    console.log(bookId.value);

    const loading = ref(false);
    const viewMessages = ref<IAlertMessage[]>([]);

    const stars = ref<number>();
    const comment = ref("");
    const status = ref<IReviewStatus>(3);
    const title = ref("");

    const isValidFields = () => {
        if (!comment.value || !stars.value) {
            viewMessages.value.push({ text: "Elements with * are required", type: "warning" });
            return false;
        }
        if (comment.value && !isValid.Text(comment.value, 1, 300))
            viewMessages.value.push({ text: "Invalid Comment Size", type: "warning" });
        if (stars.value && !isValid.Int(Number(stars.value), 1, 10)) {
            viewMessages.value.push({ text: "Invalid Stars Value", type: "warning" });
        }
        return viewMessages.value.length === 0;
    };

    const handleSubmit = async () => {
        loading.value = true;
        viewMessages.value = [];

        if (isValidFields()) {
            let response;
            const data = {
                book_id: bookId.value,
                status: status.value,
                stars: stars.value,
                comment: comment.value,
            };
            if (isEditMode) {
                response = await reviewsApi.updateReview(reviewId, data);
            } else {
                response = await reviewsApi.registerReview(data);
            }

            const { review, errors } = response;

            if (review && errors.length === 0) {
                viewMessages.value = [
                    { text: `Book ${review.book.title} ${isEditMode ? "updated" : "added"}`, type: "success" },
                ];

                router.push("/reviews");
            } else {
                viewMessages.value = errors.length ? errors : [{ text: "System Error", type: "danger" }];
            }
        }
        loading.value = false;
    };

    onMounted(async () => {
        if (isEditMode) {
            loading.value = true;
            const { review, errors } = await reviewsApi.getReviewById(reviewId);
            if (review && errors.length === 0) {
                title.value = review.book.title;

                bookId.value = review.book.id;

                status.value = statusMap(review.status_display) as IReviewStatus;
                stars.value = review.stars;
                comment.value = review.comment;
            } else {
                viewMessages.value = errors.length ? errors : [{ text: "Review not found", type: "danger" }];
            }
            loading.value = false;
        }
    });
</script>
