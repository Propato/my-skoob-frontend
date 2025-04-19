import { axios } from "@/api";

import type { IAlertMessage, IResponseReview } from "@/utils/interfaces";
import { parseBackendErrors } from "@/api/utils/parseError";

export async function searchReviews(query: string): Promise<{
    reviews: IResponseReview[];
    errors: IAlertMessage[];
}> {
    let errors: IAlertMessage[] = [];
    try {
        const response = await axios.get(`/books/reviews/search/?query=${query || ""}`);

        return { reviews: response.data, errors: errors };
    } catch (err: unknown) {
        errors = parseBackendErrors(err);
        return { reviews: [], errors: errors };
    }
}
