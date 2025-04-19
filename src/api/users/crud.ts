import { axios } from "@/api";
import type { IAlertMessage, IUser } from "@/utils/interfaces";
import { parseBackendErrors } from "@/api/utils/parseError";

export async function registerUser(payload: { email: string; name: string; password: string }): Promise<{
    user: IUser | null;
    errors: IAlertMessage[];
}> {
    let errors: IAlertMessage[] = [];
    try {
        const response = await axios.post("/users/create/", payload);
        return { user: response.data, errors: errors };
    } catch (err: unknown) {
        errors = parseBackendErrors(err);
        return { user: null, errors: errors };
    }
}

export async function updateUser(payload: Omit<IUser, "id" | "profile_picture" | "is_staff">): Promise<{
    user: IUser | null;
    errors: IAlertMessage[];
}> {
    let errors: IAlertMessage[] = [];
    try {
        const response = await axios.put("/users/details/", payload);
        return { user: response.data, errors: errors };
    } catch (err: unknown) {
        errors = parseBackendErrors(err);
        return { user: null, errors: errors };
    }
}
