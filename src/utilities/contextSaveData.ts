import { createContext } from "react"
import type { SaveData } from "~/utilities/useSaveData.ts"

export const ContextSaveData = createContext<SaveData | undefined>(undefined)
