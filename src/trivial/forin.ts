export default function <T extends Record<string, unknown>>(
    obj: T,
    fn: (key: keyof T) => void
) {
    for (const key in obj) {
        fn(key);
    }
}
