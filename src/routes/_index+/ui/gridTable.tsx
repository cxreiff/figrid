import {
    HeartFilledIcon,
    HeartIcon,
    MagnifyingGlassIcon,
    Pencil2Icon,
    PlayIcon,
    PlusIcon,
} from "@radix-ui/react-icons"
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
import { ButtonWithIconLink } from "~/ui/buttonWithIconLink.tsx"
import { Image } from "~/ui/image.tsx"
import { InputWithIcon } from "~/ui/primitives/input.tsx"
import { LayoutTitledScrolls } from "~/ui/layout/layoutTitledScrolls.tsx"
import { Button } from "~/ui/primitives/button.tsx"
import { Card } from "~/ui/primitives/card.tsx"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "~/ui/primitives/select.tsx"
import { useAssetUrl } from "~/lib/useAssetUrl.ts"
import { useFetcher } from "@remix-run/react"

type Grid = ListGridsQuery[0]

export function GridTable({
    user,
    grids,
    columns,
}: ReturnType<typeof useSuperLoaderData<typeof loader>> & {
    columns: ColumnDef<Grid>[]
}) {
    const { assetUrl, ASSET_FALLBACKS } = useAssetUrl()

    const fetcher = useFetcher()
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
                <div className="flex items-stretch gap-3">
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
                    <DataTablePagination table={table} />
                    <ButtonWithIcon
                        variant="outline"
                        className="bg-card"
                        icon={PlusIcon}
                    >
                        create grid
                    </ButtonWithIcon>
                </div>
            }
        >
            {table.getRowModel().rows.map(({ original: grid }) => {
                const liked =
                    fetcher.formAction?.startsWith("/actions/like") ||
                    (!fetcher.formAction?.startsWith("/actions/unlike") &&
                        grid.likes.find(({ user_id }) => user_id === user?.id))

                return (
                    <Card
                        key={grid.id}
                        className="mb-3 flex w-full items-center bg-card p-2 shadow-sm last:mb-0"
                    >
                        <Image
                            className="h-9 w-9 bg-background shadow-inner"
                            src={assetUrl(
                                grid.image_asset,
                                ASSET_FALLBACKS.GRID_IMAGE,
                            )}
                        />
                        <h3 className="flex flex-1 items-center">
                            <span className="mx-2 text-muted">|</span>
                            <span className="mx-2">{grid.name}</span>
                            <span className="mx-2 text-muted">|</span>
                            <Button className="mx-2">@{grid.user.alias}</Button>
                            <span className="mx-2 text-muted">|</span>
                            <span className="mx-2 text-muted-foreground">
                                {grid.summary}
                            </span>
                            <span className="mx-2 text-muted">|</span>
                            <span className="mx-2 text-muted-foreground">
                                {grid.description}
                            </span>
                        </h3>
                        <span className="px-3">{grid.likes.length} likes</span>
                        {user && (
                            <fetcher.Form
                                method="POST"
                                action={`/actions/${
                                    liked ? "unlike" : "like"
                                }/${grid.id}`}
                            >
                                <ButtonWithIcon
                                    icon={liked ? HeartFilledIcon : HeartIcon}
                                    type="submit"
                                />
                            </fetcher.Form>
                        )}
                        <div className="ml-4 flex w-[5.8rem] gap-2">
                            {user?.id === grid.user_id && (
                                <>
                                    <ButtonWithIconLink
                                        className="h-9 flex-1"
                                        variant="outline"
                                        to={`/write/${grid.id}`}
                                        icon={Pencil2Icon}
                                    />
                                    <ButtonWithIconLink
                                        className="h-9 flex-1"
                                        variant="outline"
                                        to={`/read/${grid.id}`}
                                        icon={PlayIcon}
                                    />
                                </>
                            )}
                            {user?.id !== grid.user_id && (
                                <ButtonWithIconLink
                                    className="h-9 w-full flex-1"
                                    variant="outline"
                                    to={`/read/${grid.id}`}
                                    icon={PlayIcon}
                                >
                                    PLAY
                                </ButtonWithIconLink>
                            )}
                        </div>
                    </Card>
                )
            })}
        </LayoutTitledScrolls>
    )
}
