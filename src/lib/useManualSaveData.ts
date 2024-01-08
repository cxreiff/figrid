import { useLocalStorageArray } from "~/lib/useLocalStorageArray.ts"
import type { SaveData } from "~/lib/useSaveData.ts"

export function useManualSaveData(userId: number, gridId: number) {
    return useLocalStorageArray<SaveData>(
        `SAVE_DATA.MANUAL.${userId}.${gridId}`,
    )
}
