import type { AxiosError } from "axios";
import type { IAlertMessage } from "@/utils/interfaces";

export function parseBackendErrors(error: unknown): IAlertMessage[] {
    const messages: IAlertMessage[] = [];

    const responseData = (error as AxiosError)?.response?.data as Record<string, unknown>;

    // if (typeof responseData === "string") {
    // messages.push({ text: responseData, type: "danger" });
    // return messages;
    // }

    if (typeof responseData === "object" && responseData !== null) {
        for (const key in responseData) {
            const value = responseData[key];
            const keyCapitalize = key.charAt(0).toUpperCase() + key.slice(1);

            if (typeof value === "string") {
                const msgCapitalize = value.charAt(0).toUpperCase() + value.slice(1);
                messages.push({ text: msgCapitalize, type: "danger" });
            } else if (Array.isArray(value)) {
                value.forEach((msg: string) => {
                    const msgCapitalize = msg.charAt(0).toUpperCase() + msg.slice(1);
                    messages.push({ text: `${keyCapitalize}: ${msgCapitalize}`, type: "danger" });
                });
            }
        }
    }

    return messages.length > 0 ? messages : [{ text: "System Error", type: "danger" }];
}
