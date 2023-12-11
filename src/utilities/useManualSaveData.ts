import { useLocalStorageArray } from "~/utilities/useLocalStorageArray.ts"
import type { SaveData } from "~/utilities/useSaveData.ts"

export function useManualSaveData(userId: number, gridId: number) {
    return useLocalStorageArray<SaveData>(
        `SAVE_DATA.MANUAL.${userId}.${gridId}`,
    )
}
