import { MagnifyingGlassIcon, PlusIcon } from "@radix-ui/react-icons"
import {
    type ColumnDef,
    flexRender,
    getCoreRowModel,
    useReactTable,
} from "@tanstack/react-table"
import { ButtonWithIcon } from "~/components/buttonWithIcon.tsx"
import { InputWithIcon } from "~/components/inputWithIcon.tsx"
import { LayoutTitledScrolls } from "~/components/layout/layoutTitledScrolls.tsx"
import { Card } from "~/components/ui/card.tsx"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "~/components/ui/table.tsx"

export function GridTable<TData extends { id: number }, TValue>({
    columns,
    data,
}: {
    columns: ColumnDef<TData, TValue>[]
    data: TData[]
}) {
    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
    })

    return (
        <LayoutTitledScrolls
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
                    <ButtonWithIcon variant="outline" icon={PlusIcon}>
                        create grid
                    </ButtonWithIcon>
                </div>
            }
        >
            <Table>
                <TableHeader>
                    {table.getHeaderGroups().map((headerGroup) => (
                        <TableRow key={headerGroup.id}>
                            {headerGroup.headers.map((header) => {
                                return (
                                    <TableHead key={header.id}>
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(
                                                  header.column.columnDef
                                                      .header,
                                                  header.getContext(),
                                              )}
                                    </TableHead>
                                )
                            })}
                        </TableRow>
                    ))}
                </TableHeader>
                <TableBody>
                    {table.getRowModel().rows?.length ? (
                        table.getRowModel().rows.map((row) => (
                            <TableRow
                                key={row.id}
                                data-state={row.getIsSelected() && "selected"}
                            >
                                {row.getVisibleCells().map((cell) => (
                                    <TableCell key={cell.id}>
                                        {flexRender(
                                            cell.column.columnDef.cell,
                                            cell.getContext(),
                                        )}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell
                                colSpan={columns.length}
                                className="h-24 text-center"
                            >
                                No results.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </LayoutTitledScrolls>
    )
}
