export interface IBook {
    id: number;
    name: string;
    author: string;
    pags?: number;
    release?: number;
    validate?: boolean;
}
