import { Card } from "~/components/ui/card.tsx"
import { DataLocal } from "~/routes/read+/data/dataLocal.tsx"
import { type useSaveData } from "~/lib/useSaveData.ts"

export function Data({
    replaceSave,
}: {
    replaceSave: ReturnType<typeof useSaveData>[2]
}) {
    return (
        <Card className="h-full p-4 pb-0">
            <DataLocal replaceSave={replaceSave} />
        </Card>
    )
}
