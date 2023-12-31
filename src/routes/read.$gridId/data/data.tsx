import { Card } from "~/components/ui/card.tsx"
import { DataLocal } from "~/routes/read.$gridId/data/dataLocal.tsx"
import { type useSaveData } from "~/utilities/useSaveData.ts"

export function Data({
    replaceSave,
}: {
    replaceSave: ReturnType<typeof useSaveData>[2]
}) {
    return (
        <Card className="h-full pt-4">
            <div className="h-full overflow-auto px-5">
                <DataLocal replaceSave={replaceSave} />
            </div>
        </Card>
    )
}
