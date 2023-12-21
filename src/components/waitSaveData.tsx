import { useContext, type ComponentProps } from "react"
import { Wait } from "~/components/wait.tsx"
import { ContextSaveData } from "~/utilities/contextSaveData.ts"
import type { SaveData } from "~/utilities/useSaveData.ts"

export function WaitSaveData(
    props: Omit<ComponentProps<typeof Wait<SaveData>>, "on">,
) {
    const saveData = useContext(ContextSaveData)
    return <Wait on={saveData} {...props} />
}