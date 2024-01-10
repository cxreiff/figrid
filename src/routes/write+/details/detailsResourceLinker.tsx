import { useFetcher } from "@remix-run/react"
import { ActionBox } from "~/components/actionBox.tsx"

export function DetailsResourceLinker<
    T extends { id: number | string; name: string },
>({
    options,
    getLinkUrl,
}: {
    options: T[]
    getLinkUrl: (id: T["id"]) => string
}) {
    const fetcher = useFetcher()

    return (
        <ActionBox
            className="w-full"
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
            link resource
        </ActionBox>
    )
}
