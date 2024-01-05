import {
    ChevronRightIcon,
    DragHandleDots1Icon,
    MagnifyingGlassIcon,
    PlusIcon,
} from "@radix-ui/react-icons"
import {
    type ColumnDef,
    flexRender,
    getCoreRowModel,
    useReactTable,
    type ColumnFiltersState,
    getFilteredRowModel,
} from "@tanstack/react-table"
import { useState } from "react"
import { LayoutTitledScrolls } from "~/components/layoutTitledScrolls.tsx"
import { Button } from "~/components/ui/button.tsx"
import { Card } from "~/components/ui/card.tsx"
import { InputWithIcon } from "~/components/ui/input.tsx"
import type { SelectedResource } from "~/routes/write.$gridId/route.tsx"
import { cn } from "~/utilities/misc.ts"

export function CardStack<TData extends { id: number; name: string }, TValue>({
    columns,
    data,
    selected,
    onSelection,
}: {
    columns: ColumnDef<TData, TValue>[]
    data: TData[]
    selected: SelectedResource
    onSelection: (id: number) => void
}) {
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        onColumnFiltersChange: setColumnFilters,
        getFilteredRowModel: getFilteredRowModel(),
        state: {
            columnFilters,
        },
    })

    return (
        <LayoutTitledScrolls
            title="tiles"
            actionSlot={
                <Button
                    key="create"
                    variant="ghost"
                    size="icon"
                    onClick={() => {}}
                >
                    <PlusIcon />
                </Button>
            }
            subheadSlot={
                <Card>
                    <InputWithIcon
                        className="[&>input]:border-none"
                        icon={MagnifyingGlassIcon}
                        placeholder="filter by name..."
                        value={
                            (table
                                .getColumn("name")
                                ?.getFilterValue() as string) ?? ""
                        }
                        onChange={(event) =>
                            table
                                .getColumn("name")
                                ?.setFilterValue(event.target.value)
                        }
                    />
                </Card>
            }
        >
            {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                    <Button
                        key={row.id}
                        variant="ghost"
                        className={cn(
                            "mb-3 flex items-center gap-3 px-3 py-6",
                            {
                                "border-accent bg-[hsla(var(--accent)/0.1)]":
                                    selected?.id === row.original.id &&
                                    selected?.type === "tile",
                            },
                        )}
                        onClick={() => onSelection(row.original.id)}
                        asChild
                    >
                        <Card>
                            <DragHandleDots1Icon />
                            {row.getVisibleCells().map((cell) => (
                                <div
                                    key={cell.id}
                                    className="flex-1 text-foreground"
                                >
                                    {flexRender(
                                        cell.column.columnDef.cell,
                                        cell.getContext(),
                                    )}
                                </div>
                            ))}
                            <ChevronRightIcon />
                        </Card>
                    </Button>
                ))
            ) : (
                <div className="text-center">No results.</div>
            )}
        </LayoutTitledScrolls>
    )
}
