import type { ColumnDef } from "@tanstack/react-table"
import type { ListGridsQuery } from "~/routes/_index+/lib/queries.server.ts"

export const GRID_TABLE_COLUMN_IDS = ["name", "summary", "user_alias"] as const

export const GRID_TABLE_COLUMNS: {
    [id in (typeof GRID_TABLE_COLUMN_IDS)[number]]: {
        key: string
        label: string
        accessor?: (grid: ListGridsQuery[0]) => string
    }
} = {
    name: { key: "name", label: "name" },
    summary: { key: "summary", label: "summary" },
    user_alias: {
        key: "user.alias",
        label: "alias",
        accessor: (grid) => grid.user.alias,
    },
} as const

export const GRID_COLUMN_DEFINITIONS: ColumnDef<ListGridsQuery[0]>[] =
    Object.entries(GRID_TABLE_COLUMNS).map(([id, column]) => ({
        id,
        accessorKey: column.key,
        accessorFn: column.accessor,
    }))
