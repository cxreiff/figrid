import { Card } from "~/components/ui/card.tsx"
import { MapTile } from "~/routes/read+/map/mapTile.tsx"
import { indicesArray } from "~/lib/misc.ts"

import { useContext } from "react"
import { WaitSaveData } from "~/components/waitSaveData.tsx"
import type { TileWithCoords } from "~/routes/read+/processing.server.ts"
import type { loader } from "~/routes/read+/+$gridId.tsx"
import { ContextCommand } from "~/lib/contextCommand.ts"
import { useSuperLoaderData } from "~/lib/superjson.ts"

const MAP_DIMENSIONS = { x: 13, y: 19 }
export const TILE_DIMENSIONS = { x: 6, y: 6 }

export function Map() {
    const { tileIdMap, tileCoordsMap } = useSuperLoaderData<typeof loader>()
    const handleCommand = useContext(ContextCommand)

    const BlankTile = () => (
        <div
            style={{
                width: `${TILE_DIMENSIONS.x}rem`,
                height: `${TILE_DIMENSIONS.y}rem`,
            }}
            className="border border-dashed border-muted-foreground opacity-50"
        />
    )

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
                        className="relative grid h-full gap-3"
                        style={{
                            width: `${
                                MAP_DIMENSIONS.x * TILE_DIMENSIONS.x +
                                (MAP_DIMENSIONS.x - 1) * 0.75
                            }rem`,
                            gridTemplateColumns: `repeat(${MAP_DIMENSIONS.x}, minmax(0, 1fr))`,
                        }}
                    >
                        {offsetMatrix.map((row) =>
                            row.map((offset) => (
                                <WaitSaveData
                                    key={offset.join(",")}
                                    meanwhile={<BlankTile />}
                                >
                                    {(saveData) => {
                                        const currentTile = tileIdMap[
                                            saveData.currentTileId
                                        ] as TileWithCoords
                                        const tileId =
                                            tileCoordsMap[
                                                [
                                                    currentTile.coords![0] +
                                                        offset[0],
                                                    currentTile.coords![1] +
                                                        offset[1],
                                                    currentTile.coords![2],
                                                ].join(",")
                                            ]
                                        const mapTile =
                                            tileId && tileIdMap[tileId]

                                        if (!mapTile) {
                                            return <BlankTile />
                                        }

                                        let handleClick
                                        if (!saveData.currentEventId) {
                                            for (const gate of currentTile.gates_out) {
                                                if (
                                                    tileId === gate.to_tile_id
                                                ) {
                                                    handleClick = () =>
                                                        handleCommand(
                                                            `go ${gate.type}`,
                                                        )
                                                }
                                            }
                                        }

                                        return (
                                            <MapTile
                                                saveData={saveData}
                                                mapTile={mapTile}
                                                handleClick={handleClick}
                                            />
                                        )
                                    }}
                                </WaitSaveData>
                            )),
                        )}
                    </div>
                </div>
            </div>
        </Card>
    )
}