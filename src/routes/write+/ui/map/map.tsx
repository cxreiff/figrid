import { Card } from "~/ui/primitives/card.tsx"
import { MapTile } from "~/routes/write+/ui/map/mapTile.tsx"
import { defined, indicesArray } from "~/lib/misc.ts"

import type { ResourceType, loader } from "~/routes/write+/+$gridId.tsx"
import { useSuperLoaderData } from "~/lib/superjson.ts"
import { paramsSchema } from "~/routes/write+/$gridId+/+$resourceType.$resourceId.tsx"
import { useLocation, useParams } from "@remix-run/react"
import { useEffect, useMemo, useState } from "react"
import type {
    IdMap,
    WriteTileWithCoords,
} from "~/routes/read+/lib/processing.server.ts"
import { MapTileCreate } from "~/routes/write+/ui/map/mapTileCreate.tsx"
import { ButtonWithIcon } from "~/ui/buttonWithIcon.tsx"
import { ThickArrowDownIcon, ThickArrowUpIcon } from "@radix-ui/react-icons"
import type { WriteGridQuery } from "~/routes/write+/lib/queries.server.ts"
import { usePrevious } from "~/lib/usePrevious.ts"

const MAP_DIMENSIONS = { x: 13, y: 19 }
export const TILE_DIMENSIONS = { x: 4, y: 4 }

const ORIGIN = [0, 0, 0] as const

export function Map() {
    const { resourceType, resourceId } = paramsSchema
        .partial()
        .parse(useParams())

    const { grid, tileIdMap, tileCoordsMap, gateIdMap } =
        useSuperLoaderData<typeof loader>()

    const { pathname } = useLocation()
    const previousPathname = usePrevious(pathname, "")

    const currentTile = useMemo(
        () => getCurrentTile(resourceType, resourceId, tileIdMap, gateIdMap),
        [resourceType, resourceId, tileIdMap, gateIdMap],
    )

    const [focusedCoords, setFocusedCoords] = useState<
        readonly [number, number, number]
    >(currentTile && currentTile.coords ? currentTile.coords : ORIGIN)

    const increaseZ = () =>
        setFocusedCoords([
            focusedCoords[0],
            focusedCoords[1],
            focusedCoords[2] + 1,
        ])

    const decreaseZ = () =>
        setFocusedCoords([
            focusedCoords[0],
            focusedCoords[1],
            focusedCoords[2] - 1,
        ])

    useEffect(() => {
        if (currentTile?.coords && previousPathname !== pathname) {
            setFocusedCoords(currentTile.coords)
        }
    }, [currentTile, pathname, previousPathname])

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
                                    focusedCoords[0] + offset[0],
                                    focusedCoords[1] + offset[1],
                                    focusedCoords[2],
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
                                        .map(([type, coords]) => ({
                                            type,
                                            id: tileCoordsMap[coords.join(",")],
                                        }))
                                        .map(({ type, id }) =>
                                            id !== undefined
                                                ? { type, id }
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
            <div className="absolute right-3 top-3 flex flex-col items-center justify-center">
                <ButtonWithIcon icon={ThickArrowUpIcon} onClick={increaseZ} />
                <span>{focusedCoords[2]}</span>
                <ButtonWithIcon icon={ThickArrowDownIcon} onClick={decreaseZ} />
            </div>
        </Card>
    )
}

export function getNeighboringCoordinates(
    coords: readonly [number, number, number],
) {
    return [
        ["east", [coords[0] + 1, coords[1], coords[2]]],
        ["west", [coords[0] - 1, coords[1], coords[2]]],
        ["south", [coords[0], coords[1] + 1, coords[2]]],
        ["north", [coords[0], coords[1] - 1, coords[2]]],
        ["up", [coords[0], coords[1], coords[2] + 1]],
        ["down", [coords[0], coords[1], coords[2] - 1]],
    ] as const
}

function getCurrentTile(
    resourceType: ResourceType | undefined,
    resourceId: number | undefined,
    tileIdMap: IdMap<WriteGridQuery["tiles"][0]>,
    gateIdMap: IdMap<WriteGridQuery["gates"][0]>,
): WriteTileWithCoords | undefined {
    if (resourceId === undefined) {
        return undefined
    }

    if (resourceType === "tiles") {
        return tileIdMap[resourceId]
    }

    if (resourceType === "gates") {
        return tileIdMap[gateIdMap[resourceId].from_tile_id]
    }

    return undefined
}
