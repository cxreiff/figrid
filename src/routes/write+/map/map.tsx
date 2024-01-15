import { Card } from "~/components/ui/card.tsx"
import { MapTile } from "~/routes/write+/map/mapTile.tsx"
import { defined, indicesArray } from "~/lib/misc.ts"

import type { loader } from "~/routes/write+/+$gridId.tsx"
import { useSuperLoaderData } from "~/lib/superjson.ts"
import { paramsSchema } from "~/routes/write+/$gridId+/+$resourceType.$resourceId.tsx"
import { useParams } from "@remix-run/react"
import { useEffect, useState } from "react"
import type { WriteTileWithCoords } from "~/routes/read+/processing.server.ts"
import { MapTileCreate } from "~/routes/write+/map/mapTileCreate.tsx"

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

    const currentTile: WriteTileWithCoords | undefined = currentTileId
        ? tileIdMap[currentTileId]
        : undefined

    const [focusedTileId, setFocusedTileId] = useState<number>(
        currentTile && currentTile.coords ? currentTile.id : grid.first_tile_id,
    )
    const focusedTile: WriteTileWithCoords = tileIdMap[focusedTileId]

    useEffect(() => {
        if (currentTile && currentTile.coords) {
            setFocusedTileId(currentTile.id)
        }
    }, [currentTile])

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
                                const currentCoords = [
                                    focusedTile.coords![0] + offset[0],
                                    focusedTile.coords![1] + offset[1],
                                    focusedTile.coords![2],
                                ] as const

                                const tileId =
                                    tileCoordsMap[currentCoords.join(",")]

                                const mapTile = tileId
                                    ? tileIdMap[tileId]
                                    : undefined

                                if (!mapTile) {
                                    const neighbors = getNeighboringCoordinates(
                                        currentCoords,
                                    )
                                        .map(
                                            ([type, coords]) =>
                                                [
                                                    type,
                                                    tileCoordsMap[
                                                        coords.join(",")
                                                    ],
                                                ] as const,
                                        )
                                        .map(([type, tileId]) =>
                                            tileId !== undefined
                                                ? ([type, tileId] as const)
                                                : undefined,
                                        )
                                        .filter(defined)

                                    if (neighbors.length > 0) {
                                        return (
                                            <MapTileCreate
                                                key={offset.join(",")}
                                                neighbors={neighbors}
                                                tiles={grid.tiles}
                                            />
                                        )
                                    }

                                    return (
                                        <div
                                            key={offset.join(",")}
                                            style={{
                                                width: `${TILE_DIMENSIONS.x}rem`,
                                                height: `${TILE_DIMENSIONS.y}rem`,
                                            }}
                                            className="border border-dashed border-muted-foreground opacity-50"
                                        />
                                    )
                                }

                                return (
                                    <MapTile
                                        key={offset.join(",")}
                                        current={
                                            mapTile && currentTile
                                                ? currentTile.id === mapTile.id
                                                : false
                                        }
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

function getNeighboringCoordinates(coords: readonly [number, number, number]) {
    return [
        ["east", [coords[0] + 1, coords[1], coords[2]]],
        ["west", [coords[0] - 1, coords[1], coords[2]]],
        ["south", [coords[0], coords[1] + 1, coords[2]]],
        ["north", [coords[0], coords[1] - 1, coords[2]]],
        ["up", [coords[0], coords[1], coords[2] + 1]],
        ["down", [coords[0], coords[1], coords[2] - 1]],
    ] as const
}
