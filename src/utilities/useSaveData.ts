import type { AuthUser } from "~/auth/auth.server.ts"
import type { GridsSelectModel } from "~/database/schema/grids.server.ts"
import { useLocalStorage } from "~/utilities/useLocalStorage.ts"

export type SaveData = {
    currentTileId: number
    characterName: string
    heldItems: number[]
}

export function useSaveData(user: AuthUser | null, grid: GridsSelectModel) {
    const [saveData, setLocalSaveData] = useLocalStorage<SaveData>(
        `SAVE_DATA.${user?.id || 0}.${grid.id}`,
        {
            currentTileId: grid.first_id,
            characterName: user?.alias || "player",
            heldItems: [],
        },
    )
    function setSaveData<T extends keyof SaveData>(key: T, value: SaveData[T]) {
        if (saveData === undefined) return
        setLocalSaveData({ ...saveData, [key]: value })
    }
    return [saveData, setSaveData, setLocalSaveData] as const
}
