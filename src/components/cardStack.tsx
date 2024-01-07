import {
    ChevronRightIcon,
    DragHandleDots1Icon,
    MagnifyingGlassIcon,
    PlusIcon,
    TextAlignJustifyIcon,
    TokensIcon,
} from "@radix-ui/react-icons"
import { useLocation, useSearchParams } from "@remix-run/react"
import {
    type ColumnDef,
    flexRender,
    getCoreRowModel,
    useReactTable,
    type ColumnFiltersState,
    getFilteredRowModel,
} from "@tanstack/react-table"
import { useState } from "react"
import { z } from "zod"
import { ButtonGroup } from "~/components/buttonGroup.tsx"
import { LayoutTitledScrolls } from "~/components/layoutTitledScrolls.tsx"
import { Button } from "~/components/ui/button.tsx"
import { Card } from "~/components/ui/card.tsx"
import { InputWithIcon } from "~/components/ui/input.tsx"
import type { ResourceType } from "~/routes/write.$gridId/route.tsx"
import { cn } from "~/utilities/misc.ts"

export function CardStack<TData extends { id: number; name: string }, TValue>({
    columns,
    type,
    data,
    selected,
    onSelection,
    onCreate,
}: {
    columns: ColumnDef<TData, TValue>[]
    type: ResourceType
    data: TData[]
    selected?: number
    onSelection: (id: number) => void
    onCreate?: () => void
}) {
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
    const [mode, setMode] = useState<"mini" | "full">("full")

    const duplicating = !!z.coerce
        .number()
        .optional()
        .parse(useSearchParams()[0].get("duplicate"))

    const { pathname } = useLocation()
    const [, , , resourceType, createOrId] = pathname.split("/")
    const creating =
        resourceType === type && createOrId === "create" && !duplicating

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
            title={type}
            actionSlot={
                <>
                    <Button
                        variant="ghost"
                        size="icon"
                        className={cn({
                            "border-accent bg-[hsla(var(--accent)/0.4)]":
                                creating,
                        })}
                        onClick={onCreate}
                        disabled={!onCreate}
                    >
                        <PlusIcon />
                    </Button>
                </>
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
                                key: "full",
                                icon: TextAlignJustifyIcon,
                            },
                            {
                                key: "mini",
                                icon: TokensIcon,
                            },
                        ]}
                        selected={mode}
                        onSelect={setMode}
                    />
                </div>
            }
        >
            {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                    <Button
                        key={row.id}
                        variant="ghost"
                        className={cn("mb-3 h-auto items-center p-3", {
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
