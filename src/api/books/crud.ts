import { axios } from "@/api";
import type { IAlertMessage, IBook } from "@/utils/interfaces";
import { parseBackendErrors } from "@/api/utils/parseError";

export async function registerBook(payload: Omit<IBook, "id">): Promise<{
    book: IBook | null;
    errors: IAlertMessage[];
}> {
    let errors: IAlertMessage[] = [];
    try {
        const response = await axios.post("/books/create/", payload);
        return { book: response.data, errors: errors };
    } catch (err: unknown) {
        errors = parseBackendErrors(err);
        return { book: null, errors: errors };
    }
}

export async function updateBook(payload: IBook): Promise<{
    book: IBook | null;
    errors: IAlertMessage[];
}> {
    let errors: IAlertMessage[] = [];
    try {
        const response = await axios.put(`/books/${payload.id}/`, payload);
        return { book: response.data, errors: errors };
    } catch (err: unknown) {
        errors = parseBackendErrors(err);
        return { book: null, errors: errors };
    }
}

export async function getBookById(id: number): Promise<{
    book: IBook | null;
    errors: IAlertMessage[];
}> {
    let errors: IAlertMessage[] = [];
    try {
        const response = await axios.get(`/books/${id}/`);
        return { book: response.data, errors: errors };
    } catch (err: unknown) {
        errors = parseBackendErrors(err);
        return { book: null, errors: errors };
    }
}

export async function deleteBook(id: number): Promise<{
    errors: IAlertMessage[];
}> {
    let errors: IAlertMessage[] = [];
    try {
        await axios.delete(`/books/${id}`);
        return { errors: errors };
    } catch (err: unknown) {
        errors = parseBackendErrors(err);
        return { errors: errors };
    }
}
