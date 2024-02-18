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
    return (
        <span className="flex min-w-0 flex-1 flex-col items-center gap-2 sm:flex-row">
            <span className="ellipsis my-auto ml-2">{name}</span>
            <Button className="my-auto w-fit">
                <span className="ellipsis">@{alias}</span>
            </Button>
            {summary !== undefined && (
                <div className="ellipsis my-auto min-w-24 pl-2 text-muted-foreground sm:flex-1 sm:text-center">
                    {summary}
                </div>
            )}
        </span>
    )
}
