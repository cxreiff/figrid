import { Cross2Icon, MagnifyingGlassIcon } from "@radix-ui/react-icons"
import { useSearchParams } from "@remix-run/react"
import { type Table } from "@tanstack/react-table"
import { useEffect } from "react"
import { z } from "zod"
import {
    GRID_TABLE_COLUMNS,
    GRID_TABLE_COLUMN_IDS,
} from "~/routes/_index+/lib/columns.ts"
import { ButtonWithIcon } from "~/ui/buttonWithIcon.tsx"
import { InputWithIcon } from "~/ui/primitives/input.tsx"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "~/ui/primitives/select.tsx"

export const FILTER_COLUMN_SEARCH_PARAM = "filterColumn"
export const FILTER_VALUE_SEARCH_PARAM = "filterValue"

interface DataTableFilteringProps<TData> {
    table: Table<TData>
}

export function DataTableFiltering<TData>({
    table,
}: DataTableFilteringProps<TData>) {
    const [searchParams, setSearchParams] = useSearchParams()

    const filters = table
        .getAllColumns()
        .filter((column) => column.getCanFilter())

    const filterColumn = z
        .enum(GRID_TABLE_COLUMN_IDS)
        .parse(searchParams.get(FILTER_COLUMN_SEARCH_PARAM) ?? filters[0].id)

    const filterValue = searchParams.get(FILTER_VALUE_SEARCH_PARAM) ?? ""

    useEffect(() => {
        table.resetColumnFilters()
    }, [table, filterColumn])

    useEffect(() => {
        table.getColumn(filterColumn)?.setFilterValue(filterValue)
    }, [table, filterColumn, filterValue])

    return (
        <div className="flex flex-1 items-center justify-between gap-3">
            <Select
                onValueChange={(value) => {
                    setSearchParams((prev) => {
                        if (prev.get(FILTER_COLUMN_SEARCH_PARAM) !== value) {
                            prev.set(FILTER_COLUMN_SEARCH_PARAM, value)
                            prev.set(FILTER_VALUE_SEARCH_PARAM, "")
                        }
                        return prev
                    })
                }}
                value={filterColumn}
            >
                <SelectTrigger className="bg-card">
                    <SelectValue>
                        {GRID_TABLE_COLUMNS[filterColumn].label}
                    </SelectValue>
                </SelectTrigger>
                <SelectContent>
                    {filters.map((filter) => (
                        <SelectItem key={filter.id} value={filter.id}>
                            {
                                GRID_TABLE_COLUMNS[
                                    filter.id as (typeof GRID_TABLE_COLUMN_IDS)[number]
                                ].label
                            }
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
            <InputWithIcon
                className="h-9 flex-1 border bg-card [&>input]:border-none [&>input]:shadow-none"
                icon={MagnifyingGlassIcon}
                placeholder={`filter by ${GRID_TABLE_COLUMNS[filterColumn].label}...`}
                value={filterValue}
                onChange={(event) =>
                    setSearchParams((prev) => {
                        prev.set(FILTER_VALUE_SEARCH_PARAM, event.target.value)
                        return prev
                    })
                }
            />
            {searchParams.get(FILTER_VALUE_SEARCH_PARAM) && (
                <ButtonWithIcon
                    icon={Cross2Icon}
                    variant="outline"
                    className="bg-card"
                    onClick={() =>
                        setSearchParams((prev) => {
                            prev.delete(FILTER_VALUE_SEARCH_PARAM)
                            return prev
                        })
                    }
                />
            )}
        </div>
    )
}
