import { createContext } from "react"
import type { SaveData } from "~/lib/useSaveData.ts"

export const ContextSaveData = createContext<SaveData | undefined>(undefined)
