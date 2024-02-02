import type { ColumnDef } from "@tanstack/react-table"
import type { ListGridsQuery } from "~/routes/_index+/lib/queries.server.ts"

export const COLUMN_DEFINITION: ColumnDef<ListGridsQuery[0]>[] = [
    { accessorKey: "id" },
    { accessorKey: "image_asset" },
    { accessorKey: "name" },
    { accessorKey: "summary" },
    { accessorKey: "description" },
    { accessorKey: "user_id" },
    { accessorKey: "user" },
]
