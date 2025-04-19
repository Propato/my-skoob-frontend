import { axios } from "@/api";
import type { IAlertMessage, IRequestReview, IResponseReview } from "@/utils/interfaces";
import { parseBackendErrors } from "@/api/utils/parseError";

export async function registerReview(payload: IRequestReview): Promise<{
    review: IResponseReview | null;
    errors: IAlertMessage[];
}> {
    let errors: IAlertMessage[] = [];
    try {
        const response = await axios.post("/books/reviews/create/", payload);
        return { review: response.data, errors: errors };
    } catch (err: unknown) {
        errors = parseBackendErrors(err);
        return { review: null, errors: errors };
    }
}

export async function updateReview(
    id: number,
    payload: IRequestReview,
): Promise<{
    review: IResponseReview | null;
    errors: IAlertMessage[];
}> {
    let errors: IAlertMessage[] = [];
    try {
        const response = await axios.put(`/books/reviews/${id}/`, payload);
        return { review: response.data, errors: errors };
    } catch (err: unknown) {
        errors = parseBackendErrors(err);
        return { review: null, errors: errors };
    }
}

export async function getReviewById(id: number): Promise<{
    review: IResponseReview | null;
    errors: IAlertMessage[];
}> {
    let errors: IAlertMessage[] = [];
    try {
        const response = await axios.get(`/books/reviews/${id}/`);
        return { review: response.data, errors: errors };
    } catch (err: unknown) {
        errors = parseBackendErrors(err);
        return { review: null, errors: errors };
    }
}

export async function deleteReview(id: number): Promise<{
    errors: IAlertMessage[];
}> {
    let errors: IAlertMessage[] = [];
    try {
        await axios.delete(`/books/reviews/${id}`);
        return { errors: errors };
    } catch (err: unknown) {
        errors = parseBackendErrors(err);
        return { errors: errors };
    }
}
