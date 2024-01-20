import type { AuthUser } from "~/auth/auth.server.ts"
import type { GridQuery } from "~/routes/read+/queries.server.ts"
import { useLocalStorage } from "~/lib/useLocalStorage.ts"

export type SaveData = {
    currentTileId: number
    currentEventId?: number
    characterName: string
    visited: number[]
    heldItems: number[]
    usedItems: number[]
    unlocked: number[]
    unlockedInstances: number[]
}

export function useSaveData(user: AuthUser | null, grid: GridQuery) {
    const [saveData, setLocalSaveData] = useLocalStorage<SaveData>(
        `SAVE_DATA.${user?.id || 0}.${grid.id}`,
        {
            currentTileId: grid.first_tile_id,
            currentEventId: undefined,
            characterName: user?.alias || "player",
            visited: [grid.first_tile_id],
            heldItems: [],
            usedItems: [],
            unlocked: [],
            unlockedInstances: [],
        },
    )
    function setSaveData<T extends keyof SaveData>(key: T, value: SaveData[T]) {
        if (saveData === undefined) return
        setLocalSaveData((prev) => {
            if (!prev) return
            return { ...prev, [key]: value }
        })
    }
    return [saveData, setSaveData, setLocalSaveData] as const
}
