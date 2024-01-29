import { PlusIcon } from "@radix-ui/react-icons"
import { useFetcher } from "@remix-run/react"
import { ActionBox } from "~/components/actionBox.tsx"
import type { gates } from "~/database/schema/gates.server.ts"
import { TILE_DIMENSIONS } from "~/routes/write+/ui/map/map.tsx"
import type { WriteGridQuery } from "~/routes/write+/lib/queries.server.ts"

export function MapTileCreate({
    neighbors,
    tiles,
}: {
    neighbors: { type: typeof gates.$inferSelect.type; id: number }[]
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
                const searchParams = new URLSearchParams()
                for (const neighbor of neighbors) {
                    searchParams.append(neighbor.type, neighbor.id.toString())
                }
                await fetcher.submit(null, {
                    method: "POST",
                    action: `tiles/${option.id}/gates/link?${searchParams}`,
                    navigate: true,
                })
            }}
        />
    )
}
