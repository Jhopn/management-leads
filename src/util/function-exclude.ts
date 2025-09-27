export function exclude<T extends Record<string, any>>(user: T, keys: string[]): Omit<T, typeof keys[number]> {
    const result = { ...user };
    for (const key of keys) {
        delete result[key];
    }
    return result;
}
