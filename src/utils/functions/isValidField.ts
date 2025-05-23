export function Text(text: string, bottomLimit = 0, upperLimit = 300): boolean {
    return bottomLimit < text.length && text.length <= upperLimit;
}

export function Int(value: number, bottomLimit = 0, upperLimit = 10000) {
    return Number.isInteger(value) && bottomLimit <= value && value <= upperLimit;
}

export function Email(email: string): boolean {
    const atIndex = email.indexOf("@");
    if (atIndex <= 0 || atIndex !== email.lastIndexOf("@")) return false;

    if (/\s/.test(email)) return false;

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-z]{2,}$/;
    return emailRegex.test(email);
}

export function Password(password: string): boolean {
    return (
        password.length >= 8 &&
        /[a-z]/.test(password) &&
        /[A-Z]/.test(password) &&
        /[0-9]/.test(password) &&
        /[!@#$%^&*(),.?":{}|<>]/.test(password)
    );
}
