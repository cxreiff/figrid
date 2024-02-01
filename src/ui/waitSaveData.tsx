import { useContext, type ComponentProps } from "react"
import { Wait } from "~/ui/wait.tsx"
import { ContextSaveData } from "~/lib/contextSaveData.ts"
import type { SaveData } from "~/lib/useSaveData.ts"

export function WaitSaveData(
    props: Omit<ComponentProps<typeof Wait<SaveData>>, "on">,
) {
    const saveData = useContext(ContextSaveData)
    return <Wait on={saveData} {...props} />
}
