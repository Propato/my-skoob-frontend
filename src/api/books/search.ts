import axios from "axios";

import type { IAlertMessage, IBook } from "@/utils/interfaces";
import { parseBackendErrors } from "../utils/parseError";

export async function search(payload: {
    search: string;
    filter: {
        read: boolean;
        reading: boolean;
        drop: boolean;
        list: boolean;
    };
}): Promise<{
    books: IBook | null;
    errors: IAlertMessage[];
}> {
    let errors: IAlertMessage[] = [];
    try {
        console.log(payload);

        /*
        backend: criar o endpoint de busca

        frontend: Fazer a busca com o filtro de texto e listas aqui
            caso nao tenha listas, retorna todos os livros, caso tenha listas selecionadas, retorna só as minhas selecionadas
        */

        const response = await axios.get("/books/search");
        return { books: response.data, errors: errors };
    } catch (err: unknown) {
        errors = parseBackendErrors(err);
        return { books: null, errors: errors };
    }
}
