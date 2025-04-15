export interface IBook {
    id: number;
    title: string;
    overview: string;
    author: string;
    pages?: number;
    release_year?: number;
    validate?: boolean;
}
