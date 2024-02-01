import {
    ChevronRightIcon,
    DragHandleDots1Icon,
    MagnifyingGlassIcon,
    PlusIcon,
    TextAlignJustifyIcon,
    TokensIcon,
} from "@radix-ui/react-icons"
import {
    type ColumnDef,
    flexRender,
    getCoreRowModel,
    useReactTable,
    type ColumnFiltersState,
    getFilteredRowModel,
    getSortedRowModel,
    type SortingState,
} from "@tanstack/react-table"
import { useState } from "react"
import { ButtonGroup } from "~/components/buttonGroup.tsx"
import { InputWithIcon } from "~/components/inputWithIcon.tsx"
import { LayoutTitledScrolls } from "~/components/layout/layoutTitledScrolls.tsx"
import { Button } from "~/components/ui/button.tsx"
import { Card } from "~/components/ui/card.tsx"
import { cn } from "~/lib/misc.ts"

export function CardStack<TValue>({
    title,
    columns,
    data,
    selected,
    creating,
    onSelection,
    onCreate,
}: {
    title: string
    columns: ColumnDef<{ id: number; name: string }, TValue>[]
    data: { id: number; name: string }[]
    selected?: number
    creating: boolean
    onSelection: (id: number) => void
    onCreate?: () => void
}) {
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
    const [mode, setMode] = useState<"mini" | "full">("full")
    const [sorting] = useState<SortingState>([{ desc: false, id: "name" }])

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        onColumnFiltersChange: setColumnFilters,
        getFilteredRowModel: getFilteredRowModel(),
        getSortedRowModel: getSortedRowModel(),
        state: {
            columnFilters,
            sorting,
        },
    })

    return (
        <LayoutTitledScrolls
            title={title}
            actionSlot={
                onCreate && (
                    <Button
                        size="icon"
                        className={cn({
                            "border-accent bg-[hsla(var(--accent)/0.4)]":
                                creating,
                        })}
                        onClick={onCreate}
                    >
                        <PlusIcon />
                    </Button>
                )
            }
            subheaderSlot={
                <div className="flex gap-3">
                    <Card className="flex-1">
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
                    <ButtonGroup
                        options={[
                            {
                                id: "full",
                                icon: TextAlignJustifyIcon,
                            },
                            {
                                id: "mini",
                                icon: TokensIcon,
                            },
                        ]}
                        selected={mode}
                        onSelect={setMode}
                    />
                </div>
            }
        >
            {table.getRowModel().rows.length ? (
                table.getRowModel().rows.map((row) => (
                    <Button
                        key={row.id}
                        className={cn("my-2 h-auto items-center p-3", {
                            "flex gap-3": mode === "full",
                            "mr-3 inline-block whitespace-nowrap [&>div]:inline-block [&>svg:first-child]:mr-2 [&>svg:first-child]:inline-block":
                                mode === "mini",
                            "border-accent bg-[hsla(var(--accent)/0.4)]":
                                selected === row.original.id,
                        })}
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
                            <ChevronRightIcon
                                className={cn({ hidden: mode === "mini" })}
                            />
                        </Card>
                    </Button>
                ))
            ) : (
                <div className="text-center">No results.</div>
            )}
        </LayoutTitledScrolls>
    )
}
