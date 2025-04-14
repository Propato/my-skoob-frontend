import { axios } from "@/api";
import { type IAlertMessage, type IUser } from "@/utils/interfaces";
import { parseBackendErrors } from "@/api/utils/parseError";

export async function login(payload: { email: string; password: string }): Promise<{
    token: string | null;
    user: IUser | null;
    errors: IAlertMessage[];
}> {
    let errors: IAlertMessage[] = [];
    try {
        const response = await axios.post("/users/login/", payload);
        return { token: response.data.token, user: response.data.user, errors: errors };
    } catch (err: unknown) {
        errors = parseBackendErrors(err);
        return { token: null, user: null, errors: errors };
    }
}
