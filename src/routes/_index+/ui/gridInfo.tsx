import { useSearchParams } from "@remix-run/react"
import {
    FILTER_COLUMN_SEARCH_PARAM,
    FILTER_VALUE_SEARCH_PARAM,
} from "~/routes/_index+/ui/dataTableFiltering.tsx"
import { Button } from "~/ui/primitives/button.tsx"

export function GridInfo({
    name,
    alias,
    summary,
}: {
    name: string
    alias: string
    summary?: string
}) {
    const [, setSearchParams] = useSearchParams()

    return (
        <span className="flex min-w-0 flex-1 flex-col items-center sm:flex-row sm:gap-4">
            <Button
                variant="inline"
                className="my-auto w-fit max-w-full sm:h-full"
                onClick={() =>
                    setSearchParams((prev) => {
                        prev.set(FILTER_COLUMN_SEARCH_PARAM, "user_alias")
                        prev.set(FILTER_VALUE_SEARCH_PARAM, alias)
                        return prev
                    })
                }
            >
                <span className="ellipsis max-w-full">@{alias}</span>
            </Button>
            <span className="ellipsis my-auto max-w-full">{name}</span>
            {summary !== undefined && (
                <div className="ellipsis my-auto max-w-full text-muted-foreground sm:flex-1">
                    {summary}
                </div>
            )}
        </span>
    )
}
