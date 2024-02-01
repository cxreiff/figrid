import { PlusIcon } from "@radix-ui/react-icons"
import { useFetcher } from "@remix-run/react"
import { ActionBox } from "~/ui/actionBox.tsx"
import { cn } from "~/lib/misc.ts"

export function DetailsResourceLinker<
    T extends { id: number | string; name: string },
>({
    className,
    label,
    options,
    getLinkUrl,
}: {
    className?: string
    label?: string
    options: T[]
    getLinkUrl: (id: T["id"]) => string
}) {
    const fetcher = useFetcher()

    return (
        <ActionBox
            icon={PlusIcon}
            variant="outline"
            className={cn("shadow-sm", className)}
            options={options.map((character) => ({
                id: character.id,
                label: character.name,
            }))}
            onOptionSelect={({ id }) =>
                fetcher.submit(null, {
                    action: getLinkUrl(id),
                    method: "POST",
                })
            }
        >
            {label && (
                <span
                    className={
                        "min-w-16 px-3 text-left font-light text-muted-foreground"
                    }
                >
                    {label}
                </span>
            )}
            <span className="flex-1 px-3 text-left">link resource</span>
        </ActionBox>
    )
}
