import { Wait } from "~/components/wait.tsx"
import type { SaveData } from "~/utilities/useSaveData.ts"

export function InfoData({ saveData }: { saveData?: SaveData }) {
    return (
        <Wait on={saveData}>
            {(saveData) => {
                return <>{saveData.toString()}</>
            }}
        </Wait>
    )
}
