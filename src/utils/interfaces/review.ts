import type { IBook } from "./book";

export type IReviewDisplayStatus = "Read" | "Reading" | "Drop" | "List";
export type IReviewStatus = 0 | 1 | 2 | 3;

export const statusMap = (status: number | string): IReviewDisplayStatus | IReviewStatus | undefined => {
    const map = ["Read", "Reading", "Drop", "List"];

    for (let i = 0; i < map.length; i++) {
        if (map[i] === status) return i as IReviewStatus;
        else if (i === status) return map[i] as IReviewDisplayStatus;
    }

    return undefined;
};

export interface IFullReview {
    id: number;
    book: IBook;
    book_id: number;
    user_id: number;
    status: IReviewStatus;
    status_display: IReviewDisplayStatus;
    stars: number;
    comment: string;
}

export interface IResponseReview {
    id: number;
    book: IBook;
    user_id: number;
    status_display: IReviewDisplayStatus;
    stars: number;
    comment: string;
}

export interface IRequestReview {
    book_id: number;
    status: IReviewStatus;
    stars?: number;
    comment?: string;
}
