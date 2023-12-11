import { useEffect, useState, useCallback } from "react"

export function useLocalStorageArray<T>(key: string) {
    const [value, setValue] = useState<T[]>([])

    const refreshData = useCallback(() => {
        let index = 0
        const dataArray: T[] = []
        while (true) {
            try {
                const stored = window.localStorage.getItem(`${key}.${index++}`)
                if (stored === null) break
                dataArray.push(JSON.parse(stored) as T)
            } catch (error) {
                break
            }
        }
        setValue(dataArray)
    }, [key, setValue])

    const setData = (index: number, data: T) => {
        window.localStorage.setItem(`${key}.${index}`, JSON.stringify(data))
        refreshData()
    }

    const deleteData = (index: number) => {
        for (let i = index; i < value.length - 1; i++) {
            setData(i, value[i + 1])
        }
        window.localStorage.removeItem(`${key}.${value.length - 1}`)
        refreshData()
    }

    useEffect(() => refreshData(), [key, setValue, refreshData])

    return [value, setData, deleteData] as const
}
