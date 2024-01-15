import { type ClassValue, clsx } from "clsx"
import { useEffect, useMemo, useRef } from "react"
import { twMerge } from "tailwind-merge"

export type Replace<T, Key extends keyof T, New> = Omit<T, Key> & {
    [P in Key]: New
}

type StrictEntries<T> = {
    [K in keyof T]-?: [K, T[K]]
}[keyof T][]

export function strictEntries<T extends object>(obj: T) {
    return Object.entries(obj) as StrictEntries<T>
}

export function strictKeys<T extends object>(obj: T) {
    return Object.keys(obj) as Array<keyof T>
}

export const TILE_FALLBACK_IMAGE = "https://img.figrid.io/tiles/kitty.png"
export const PLAYER_FALLBACK_IMAGE = "https://img.figrid.io/tiles/kitty.png"

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

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

function debounce<Callback extends (...args: Parameters<Callback>) => void>(
    fn: Callback,
    delay: number,
) {
    let timer: ReturnType<typeof setTimeout> | null = null
    return (...args: Parameters<Callback>) => {
        if (timer) clearTimeout(timer)
        timer = setTimeout(() => {
            fn(...args)
        }, delay)
    }
}

export function useDebounce<
    Callback extends (...args: Parameters<Callback>) => ReturnType<Callback>,
>(callback: Callback, delay: number) {
    const callbackRef = useRef(callback)
    useEffect(() => {
        callbackRef.current = callback
    })
    return useMemo(
        () =>
            debounce(
                (...args: Parameters<Callback>) => callbackRef.current(...args),
                delay,
            ),
        [delay],
    )
}
