import { Card } from "~/components/ui/card.tsx"
import { MapTile } from "~/routes/write+/map/mapTile.tsx"
import { indicesArray } from "~/lib/misc.ts"

import type { loader } from "~/routes/write+/+$gridId.tsx"
import { useSuperLoaderData } from "~/lib/superjson.ts"
import { paramsSchema } from "~/routes/write+/$gridId+/+$resourceType.$resourceId.tsx"
import { useParams } from "@remix-run/react"
import { useEffect, useState } from "react"
import type { WriteTileWithCoords } from "~/routes/read+/processing.server.ts"

const MAP_DIMENSIONS = { x: 13, y: 19 }
export const TILE_DIMENSIONS = { x: 3, y: 3 }

export function Map() {
    const { resourceType, resourceId } = paramsSchema
        .partial()
        .parse(useParams())

    const { grid, tileIdMap, tileCoordsMap, gateIdMap } =
        useSuperLoaderData<typeof loader>()

    const currentTileId =
        resourceId !== undefined
            ? resourceType === "tiles"
                ? resourceId
                : resourceType === "gates"
                  ? gateIdMap[resourceId].from_tile_id
                  : undefined
            : undefined

    const [focusedTileId, setFocusedTileId] = useState<number>(
        currentTileId || grid.first_tile_id,
    )

    useEffect(() => {
        if (currentTileId !== undefined) {
            setFocusedTileId(currentTileId)
        }
    }, [currentTileId])

    const currentTile = currentTileId ? tileIdMap[currentTileId] : undefined
    const focusedTile: WriteTileWithCoords = tileIdMap[focusedTileId]

    const offsetMatrix = indicesArray(MAP_DIMENSIONS.y).map((y) =>
        indicesArray(MAP_DIMENSIONS.x).map(
            (x) =>
                [
                    x - Math.ceil(MAP_DIMENSIONS.x / 2),
                    y - Math.ceil(MAP_DIMENSIONS.y / 2),
                ] as const,
        ),
    )

    return (
        <Card className="h-full w-full">
            <div className="faded-edge flex h-full w-full items-center justify-center overflow-hidden rounded-md">
                <div>
                    <div
                        className="relative grid h-full gap-9"
                        style={{
                            width: `${
                                MAP_DIMENSIONS.x * TILE_DIMENSIONS.x +
                                (MAP_DIMENSIONS.x - 1) * 2.25
                            }rem`,
                            gridTemplateColumns: `repeat(${MAP_DIMENSIONS.x}, minmax(0, 1fr))`,
                        }}
                    >
                        {offsetMatrix.map((row) =>
                            row.map((offset) => {
                                const tileId =
                                    tileCoordsMap[
                                        [
                                            focusedTile.coords![0] + offset[0],
                                            focusedTile.coords![1] + offset[1],
                                            focusedTile.coords![2],
                                        ].join(",")
                                    ]

                                const mapTile = tileId
                                    ? tileIdMap[tileId]
                                    : undefined

                                return (
                                    <MapTile
                                        current={
                                            mapTile && currentTile
                                                ? currentTile.id === mapTile.id
                                                : false
                                        }
                                        key={offset.join(",")}
                                        mapTile={mapTile}
                                    />
                                )
                            }),
                        )}
                    </div>
                </div>
            </div>
        </Card>
    )
}
