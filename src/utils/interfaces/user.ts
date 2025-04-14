export interface IUser {
    id: number;
    name: string;
    email: string;
    profile_picture?: string;
    gender?: IGender;
    birthday?: Date;
    is_staff: boolean;
}

export type IGender = "FC" | "MC" | "FT" | "MT" | "N" | "O" | "";
