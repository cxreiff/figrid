import { PlusIcon } from "@radix-ui/react-icons"
import { useFetcher } from "@remix-run/react"
import { ActionBox } from "~/components/actionBox.tsx"
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
            className={cn("shadow", className)}
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
            <div className="flex px-3">
                {label && (
                    <span className={"w-14 text-left text-muted-foreground"}>
                        {label}
                    </span>
                )}
                link resource
            </div>
        </ActionBox>
    )
}
