export default function repeat<T>(count: number, v: T): T[] {
    const ret = [];
    for (let i = 0; i < count; ++i) {
        ret.push(v);
    }
    return ret;
}
