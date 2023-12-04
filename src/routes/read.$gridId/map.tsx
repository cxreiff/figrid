import type { CoordsMap, TileIdMap } from "~/routes/read.$gridId/processing.ts"
import { indicesArray } from "~/utilities/misc.ts"

const MAP_DIMENSIONS = { x: 5, y: 13 }

export function Map({
    currentTileId,
    tileIdMap,
    coordsMap,
    handleCommand,
}: {
    currentTileId: number
    tileIdMap: TileIdMap
    coordsMap: CoordsMap
    handleCommand: (command: string) => void
}) {
    const currentTile = tileIdMap[currentTileId]

    if (currentTile.coords == undefined) {
        throw new Error("coords missing for current tile")
    }

    const mapMatrix = indicesArray(MAP_DIMENSIONS.y).map((y) =>
        indicesArray(MAP_DIMENSIONS.x).map(
            (x) =>
                coordsMap[
                    [
                        currentTile.coords![0] -
                            Math.ceil(MAP_DIMENSIONS.x / 2) +
                            x,
                        currentTile.coords![1] -
                            Math.ceil(MAP_DIMENSIONS.y / 2) +
                            y,
                    ].join(",")
                ],
        ),
    )

    return (
        <div className="faded-edge flex max-h-[100%] items-center justify-center overflow-hidden rounded-lg">
            <div className={`grid h-full w-full grid-cols-5 gap-3`}>
                {mapMatrix.map((row, y) =>
                    row.map((tileId, x) => {
                        const mapTile = tileId && tileIdMap[tileId]
                        const currentTile = tileIdMap[currentTileId]

                        if (!mapTile) {
                            return (
                                <div
                                    key={`${x}-${y}`}
                                    className="h-24 border border-dashed border-zinc-500"
                                />
                            )
                        }

                        let handleClick
                        switch (tileId) {
                            case currentTile.north_id:
                                handleClick = () => handleCommand("go north")
                                break
                            case currentTile.east_id:
                                handleClick = () => handleCommand("go east")
                                break
                            case currentTile.south_id:
                                handleClick = () => handleCommand("go south")
                                break
                            case currentTile.west_id:
                                handleClick = () => handleCommand("go west")
                                break
                        }

                        return (
                            <div
                                key={tileId}
                                className={`relative h-24 border-2 border-[var(--accent-8)] ${
                                    handleClick
                                        ? "cursor-pointer hover:bg-zinc-600"
                                        : ""
                                }`}
                                onClick={handleClick}
                                style={{
                                    background:
                                        tileId === currentTileId
                                            ? "var(--accent-8)"
                                            : undefined,
                                }}
                            >
                                {mapTile.north_id && (
                                    <div className="absolute left-0 right-0 top-[-1rem] mx-auto h-4 w-4 bg-[var(--accent-8)]" />
                                )}
                                {tileId && tileIdMap[tileId].east_id && (
                                    <div className="absolute bottom-0 right-[-1rem] top-0 my-auto h-4 w-4 bg-[var(--accent-8)]" />
                                )}
                                {tileId && tileIdMap[tileId].south_id && (
                                    <div className="absolute bottom-[-1rem] left-0 right-0 mx-auto h-4 w-4 bg-[var(--accent-8)]" />
                                )}
                                {tileId && tileIdMap[tileId].west_id && (
                                    <div className="absolute bottom-0 left-[-1rem] top-0 my-auto h-4 w-4 bg-[var(--accent-8)]" />
                                )}
                            </div>
                        )
                    }),
                )}
            </div>
        </div>
    )
}
