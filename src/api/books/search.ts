import { axios } from "@/api";

import type { IAlertMessage, IBook } from "@/utils/interfaces";
import { parseBackendErrors } from "@/api/utils/parseError";

export async function searchBooks(query: string): Promise<{
    books: IBook[];
    errors: IAlertMessage[];
}> {
    let errors: IAlertMessage[] = [];
    try {
        const response = await axios.get(`/books/search/?query=${query || ""}`);

        return { books: response.data, errors: errors };
    } catch (err: unknown) {
        errors = parseBackendErrors(err);
        return { books: [], errors: errors };
    }
}
