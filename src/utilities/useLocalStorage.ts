import type { Dispatch, SetStateAction } from "react"
import { useState } from "react"
import { useDeepCompareEffectNoCheck } from "use-deep-compare-effect"

export function useLocalStorage<T>(
    key: string,
    defaultValue: T,
): [T | undefined, Dispatch<SetStateAction<T | undefined>>] {
    const [value, setValue] = useState<T | undefined>(undefined)

    useDeepCompareEffectNoCheck(() => {
        try {
            const stored = window.localStorage.getItem(key)
            setValue(stored ? (JSON.parse(stored) as T) : defaultValue)
        } catch (error) {
            setValue(defaultValue)
        }
    }, [key, defaultValue, setValue])

    useDeepCompareEffectNoCheck(() => {
        if (value !== undefined) {
            localStorage.setItem(key, JSON.stringify(value))
        }
    }, [value, key])

    return [value, setValue]
}
