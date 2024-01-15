import { PlusIcon } from "@radix-ui/react-icons"
import { useFetcher } from "@remix-run/react"
import { ActionBox } from "~/components/actionBox.tsx"
import type { gates } from "~/database/schema/gates.server.ts"
import { TILE_DIMENSIONS } from "~/routes/write+/map/map.tsx"
import type { WriteGridQuery } from "~/routes/write+/queries.server.ts"

export function MapTileCreate({
    neighbors,
    tiles,
}: {
    neighbors: (readonly [typeof gates.$inferSelect.type, number])[]
    tiles: WriteGridQuery["tiles"]
}) {
    const fetcher = useFetcher()

    return (
        <ActionBox
            icon={PlusIcon}
            style={{
                width: `${TILE_DIMENSIONS.x}rem`,
                height: `${TILE_DIMENSIONS.y}rem`,
            }}
            className="h-full w-full"
            options={tiles
                .filter((tile) => tile.gates_out.length === 0)
                .map((tile) => ({ id: tile.id, label: tile.name, tile }))}
            onOptionSelect={async (option) => {
                await fetcher.submit(
                    {
                        data: JSON.stringify(
                            neighbors.map(([type, id]) => ({
                                type,
                                id,
                            })),
                        ),
                    },
                    {
                        method: "POST",
                        action: `tiles/${option.id}/gates/link`,
                        navigate: true,
                    },
                )
            }}
        />
    )
}
