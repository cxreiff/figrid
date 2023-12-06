import type { AuthUser } from "~/auth/auth.server.ts"
import type { GridsSelectModel } from "~/database/schema/grids.server.ts"
import { useLocalStorage } from "~/utilities/useLocalStorage.ts"

export type SaveData = {
    currentTileId: number
    characterName: string
}

export function useSaveData(user: AuthUser | null, grid: GridsSelectModel) {
    const [saveData, setLocalSaveData] = useLocalStorage<SaveData>(
        `${user?.id || 0}.${grid.id}.SAVE_DATA`,
        {
            currentTileId: grid.first_id,
            characterName: user?.alias || "player",
        },
    )
    function setSaveData<T extends keyof SaveData>(key: T, value: SaveData[T]) {
        if (saveData === undefined) return
        setLocalSaveData({ ...saveData, [key]: value })
    }
    return [saveData, setSaveData] as const
}
