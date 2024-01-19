import { Wait } from "~/components/wait.tsx"
import { useSuperLoaderData, useSuperMatch } from "~/lib/superjson.ts"
import type { loader as childLoader } from "~/routes/write+/$gridId+/+$resourceType.$resourceId.tsx"
import type { WriteTileQuery } from "~/routes/write+/queries.server.ts"
import { DetailsResourceCard } from "~/routes/write+/details/detailsResourceCard.tsx"
import { DetailsResourceLinker } from "~/routes/write+/details/detailsResourceLinker.tsx"
import { ButtonIcon } from "~/components/buttonIcon.tsx"
import { Cross2Icon, PlusIcon } from "@radix-ui/react-icons"
import { useFetcher } from "@remix-run/react"
import { type loader } from "~/routes/write+/+$gridId.tsx"
import type { gates } from "~/database/schema/gates.server.ts"
import { getNeighboringCoordinates } from "~/routes/write+/map/map.tsx"
import type { WriteTileWithCoords } from "~/routes/read+/processing.server.ts"
import { cn, defined } from "~/lib/misc.ts"

const GATE_OPTIONS: (typeof gates.$inferSelect.type)[] = [
    "north",
    "east",
    "south",
    "west",
    "up",
    "down",
]

export function DetailsTilesGates() {
    const { grid, tileIdMap, tileCoordsMap } =
        useSuperLoaderData<typeof loader>()
    const resource = useSuperMatch<typeof childLoader>(
        "write.$gridId.$resourceType.$resourceId",
    )?.resource as WriteTileQuery

    const fetcher = useFetcher()

    return (
        <Wait on={resource}>
            {(resource) => [
                resource.gates_out.map(({ id, active, to_tile, type }) => (
                    <DetailsResourceCard
                        key={id}
                        label={type}
                        linkedResource={to_tile}
                        navigateUrl={`tiles/${to_tile.id}`}
                        inactive={!active}
                        actionSlot={
                            active ? (
                                <ButtonIcon
                                    icon={Cross2Icon}
                                    onClick={() => {
                                        fetcher.submit(null, {
                                            action: `gates/${id}/delete`,
                                            method: "POST",
                                        })
                                    }}
                                />
                            ) : (
                                <ButtonIcon
                                    icon={PlusIcon}
                                    onClick={() => {
                                        fetcher.submit(null, {
                                            action: `gates/${id}/enable`,
                                            method: "POST",
                                        })
                                    }}
                                />
                            )
                        }
                    />
                )),
                GATE_OPTIONS.filter(
                    (option) =>
                        !resource.gates_out.find(
                            (gate) => gate.type === option,
                        ),
                ).map((direction, index) => {
                    const currentTile: WriteTileWithCoords =
                        tileIdMap[resource.id]

                    if (!currentTile.coords) {
                        return null
                    }

                    const neighbors = getNeighboringCoordinates(
                        shiftCoordsCompassDirection(
                            currentTile.coords,
                            direction,
                        ),
                    )
                        .map(([type, coords]) => ({
                            type,
                            id: tileCoordsMap[coords.join(",")],
                        }))
                        .map(({ type, id }) =>
                            id !== undefined ? { type, id } : undefined,
                        )
                        .filter(defined)

                    const searchParams = new URLSearchParams()
                    for (const neighbor of neighbors) {
                        searchParams.append(
                            neighbor.type,
                            neighbor.id.toString(),
                        )
                    }

                    return (
                        <DetailsResourceLinker
                            key={index}
                            className={cn("mb-2", { "mt-4": index === 0 })}
                            label={direction}
                            getLinkUrl={(id) =>
                                `tiles/${id}/gates/link?${searchParams}`
                            }
                            options={grid.tiles.filter(
                                (tile) => tile.gates_out.length === 0,
                            )}
                        />
                    )
                }),
            ]}
        </Wait>
    )
}

function shiftCoordsCompassDirection(
    coords: readonly [number, number, number],
    direction: typeof gates.$inferSelect.type,
) {
    let offset = [0, 0, 0]
    switch (direction) {
        case "north":
            offset[1]--
            break
        case "east":
            offset[0]++
            break
        case "south":
            offset[1]++
            break
        case "west":
            offset[0]--
            break
        case "up":
            offset[2]++
            break
        case "down":
            offset[2]--
            break
    }
    return [
        coords[0] + offset[0],
        coords[1] + offset[1],
        coords[2] + offset[2],
    ] as const
}
