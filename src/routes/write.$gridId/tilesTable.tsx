import { type ColumnDef } from "@tanstack/react-table"
import { CardStack } from "~/components/cardStack.tsx"
import { Card } from "~/components/ui/card.tsx"
import type { WriteGridQuery } from "~/routes/write.$gridId/query.server.ts"
import type { SelectedResource } from "~/routes/write.$gridId/route.tsx"

const columns: ColumnDef<WriteGridQuery["tiles"][0]>[] = [
    { accessorKey: "name" },
]

export function TilesTable({
    data,
    selected,
    onSelection,
}: {
    data: WriteGridQuery["tiles"]
    selected: SelectedResource
    onSelection: (id: number) => void
}) {
    return (
        <Card className="h-full p-4 pb-0">
            <CardStack
                columns={columns}
                data={data}
                selected={selected}
                onSelection={onSelection}
            />
        </Card>
    )
}
