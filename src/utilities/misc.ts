export const TILE_FALLBACK_IMAGE = "https://img.figrid.io/tiles/kitty.png"
export const PLAYER_FALLBACK_IMAGE = "https://img.figrid.io/tiles/kitty.png"

export function indicesArray(size: number) {
    return Array(size)
        .fill(1)
        .map((x, y) => x + y)
}

export function commasWithConjunction(items: string[], conjunction: string) {
    if (items.length === 0) {
        return ""
    }
    if (items.length === 1) {
        return items[0]
    }
    const firsts = items.slice(0, -1)
    const last = items[items.length - 1]
    return firsts.join(", ") + ` ${conjunction} ` + last
}

export function defined<T>(value: T | null | undefined): value is T {
    if (value === null || value === undefined) return false
    return true
}
