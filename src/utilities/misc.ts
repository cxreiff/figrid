export function indicesArray(size: number) {
    return Array(size)
        .fill(1)
        .map((x, y) => x + y)
}
