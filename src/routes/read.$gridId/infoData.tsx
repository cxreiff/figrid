import { Card } from "~/components/card.tsx"
import { Wait } from "~/components/wait.tsx"
import type { SaveData } from "~/utilities/useSaveData.ts"

export function InfoData({ saveData }: { saveData?: SaveData }) {
    return (
        <Card className="h-full bg-transparent">
            <Wait on={saveData}>
                {(saveData) => {
                    return <>{JSON.stringify(saveData)}</>
                }}
            </Wait>
        </Card>
    )
}
