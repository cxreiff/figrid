import {
    ChevronLeftIcon,
    ChevronRightIcon,
    DoubleArrowLeftIcon,
    DoubleArrowRightIcon,
} from "@radix-ui/react-icons"
import { type Table } from "@tanstack/react-table"
import { ButtonWithIcon } from "~/ui/buttonWithIcon.tsx"

interface DataTablePaginationProps<TData> {
    table: Table<TData>
}

export function DataTablePagination<TData>({
    table,
}: DataTablePaginationProps<TData>) {
    return (
        <div className="flex items-center justify-between">
            <ButtonWithIcon
                icon={DoubleArrowLeftIcon}
                onClick={() => table.setPageIndex(0)}
                disabled={table.getState().pagination.pageIndex < 1}
            />
            <ButtonWithIcon
                icon={ChevronLeftIcon}
                onClick={() => table.previousPage()}
                disabled={table.getState().pagination.pageIndex < 1}
            />
            <div className="flex h-full min-w-20 items-center justify-center px-3 text-sm font-medium">
                {table.getState().pagination.pageIndex + 1} of{" "}
                {table.getPageCount()}
            </div>
            <ButtonWithIcon
                icon={ChevronRightIcon}
                onClick={() => table.nextPage()}
                disabled={
                    table.getState().pagination.pageIndex >
                    table.getPageCount() - 2
                }
            />
            <ButtonWithIcon
                icon={DoubleArrowRightIcon}
                onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                disabled={
                    table.getState().pagination.pageIndex >
                    table.getPageCount() - 2
                }
            />
        </div>
    )
}
