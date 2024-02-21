import {
    getCoreRowModel,
    getPaginationRowModel,
    useReactTable,
    type SortingState,
    getSortedRowModel,
    type PaginationState,
    type ColumnDef,
    type ColumnFiltersState,
    getFilteredRowModel,
} from "@tanstack/react-table"
import { useState } from "react"
import { type useSuperLoaderData } from "~/lib/superjson.ts"
import type { loader } from "~/routes/_index+/_index.tsx"
import type { ListGridsQuery } from "~/routes/_index+/lib/queries.server.ts"
import { DataTablePagination } from "~/routes/_index+/ui/dataTablePagination.tsx"
import { LayoutTitledScrolls } from "~/ui/layout/layoutTitledScrolls.tsx"
import { GridCard } from "~/routes/_index+/ui/gridCard.tsx"
import {
    DataTableFiltering,
    FILTER_COLUMN_SEARCH_PARAM,
    FILTER_VALUE_SEARCH_PARAM,
} from "~/routes/_index+/ui/dataTableFiltering.tsx"
import { useSearchParams } from "@remix-run/react"
import { CreateGridButton } from "~/routes/_index+/ui/createGridButton.tsx"

type Grid = ListGridsQuery[0]

export function GridTable({
    user,
    grids,
    columns,
}: ReturnType<typeof useSuperLoaderData<typeof loader>> & {
    columns: ColumnDef<Grid>[]
}) {
    const [searchParams] = useSearchParams()
    const [sorting, setSorting] = useState<SortingState>([])
    const [pagination, setPagination] = useState<PaginationState>({
        pageIndex: 0,
        pageSize: 10,
    })

    const filterColumn = searchParams.get(FILTER_COLUMN_SEARCH_PARAM)
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>(
        filterColumn
            ? [
                  {
                      id: filterColumn,
                      value: searchParams.get(FILTER_VALUE_SEARCH_PARAM),
                  },
              ]
            : [],
    )

    const table = useReactTable({
        data: grids,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        onPaginationChange: setPagination,
        getSortedRowModel: getSortedRowModel(),
        onSortingChange: setSorting,
        getFilteredRowModel: getFilteredRowModel(),
        onColumnFiltersChange: setColumnFilters,
        state: {
            sorting,
            pagination,
            columnFilters,
        },
    })

    return (
        <LayoutTitledScrolls
            subheaderSlot={
                <div className="flex flex-col items-stretch gap-3 sm:flex-row">
                    <DataTableFiltering table={table} />
                    <DataTablePagination table={table} />
                    {user && <CreateGridButton />}
                </div>
            }
        >
            {table.getRowModel().rows.map(({ original: grid }) => (
                <GridCard key={grid.id} user={user} grid={grid} />
            ))}
        </LayoutTitledScrolls>
    )
}
