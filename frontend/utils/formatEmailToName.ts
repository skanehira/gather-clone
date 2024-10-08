export function formatEmailToName(email: string) {
    const name = email.split('@')[0];
    return name;
}
