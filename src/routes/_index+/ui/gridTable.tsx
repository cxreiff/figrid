import { MagnifyingGlassIcon, PlusIcon } from "@radix-ui/react-icons"
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
import { DataTablePagination } from "~/routes/_index+/ui/tablePagination.tsx"
import { ButtonWithIcon } from "~/ui/buttonWithIcon.tsx"
import { InputWithIcon } from "~/ui/primitives/input.tsx"
import { LayoutTitledScrolls } from "~/ui/layout/layoutTitledScrolls.tsx"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "~/ui/primitives/select.tsx"
import { GridCard } from "~/routes/_index+/ui/gridCard.tsx"

type Grid = ListGridsQuery[0]

export function GridTable({
    user,
    grids,
    columns,
}: ReturnType<typeof useSuperLoaderData<typeof loader>> & {
    columns: ColumnDef<Grid>[]
}) {
    const [filterColumn, setFilterColumn] = useState<string>("name")
    const [sorting, setSorting] = useState<SortingState>([])
    const [pagination, setPagination] = useState<PaginationState>({
        pageIndex: 0,
        pageSize: 10,
    })
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])

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
                    <span className="flex flex-1 gap-3">
                        <Select
                            onValueChange={(value) => {
                                table.resetColumnFilters()
                                setFilterColumn(value)
                            }}
                            value={filterColumn}
                        >
                            <SelectTrigger className="bg-card">
                                <SelectValue>{filterColumn}</SelectValue>
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="name">name</SelectItem>
                                <SelectItem value="summary">summary</SelectItem>
                                <SelectItem value="description">
                                    description
                                </SelectItem>
                            </SelectContent>
                        </Select>
                        <InputWithIcon
                            className="h-9 flex-1 border bg-card [&>input]:border-none [&>input]:shadow-none"
                            icon={MagnifyingGlassIcon}
                            placeholder={`filter by ${filterColumn}...`}
                            value={
                                (table
                                    .getColumn(filterColumn)
                                    ?.getFilterValue() as string) ?? ""
                            }
                            onChange={(event) =>
                                table
                                    .getColumn(filterColumn)
                                    ?.setFilterValue(event.target.value)
                            }
                        />
                    </span>
                    <DataTablePagination table={table} />
                    <ButtonWithIcon
                        variant="outline"
                        className="bg-card [&>span]:hidden md:[&>span]:block"
                        icon={PlusIcon}
                    >
                        create grid
                    </ButtonWithIcon>
                </div>
            }
        >
            {table.getRowModel().rows.map(({ original: grid }) => (
                <GridCard key={grid.id} user={user} grid={grid} />
            ))}
        </LayoutTitledScrolls>
    )
}
