export function indicesArray(size: number) {
    return Array(size)
        .fill(1)
        .map((x, y) => x + y)
}

export function commasWithAnd(rawItems: (string | undefined)[]) {
    const predicate = (item?: string): item is string => item !== undefined
    const items = rawItems.filter(predicate)

    if (items.length === 0) {
        return ""
    }
    if (items.length === 1) {
        return items[0]
    }
    const firsts = items.slice(0, -1)
    const last = items[items.length - 1]
    return firsts.join(", ") + " and " + last
}
