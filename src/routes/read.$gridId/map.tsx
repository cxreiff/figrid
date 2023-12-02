import type {
    CoordsMap,
    ClientTileIdMap,
} from "~/routes/read.$gridId/route.tsx"
import { indicesArray } from "~/utilities/misc.ts"

const MAP_DIMENSIONS = { x: 5, y: 13 }

export function Map({
    currentTile,
    tileIdMap,
    coordsMap,
}: {
    currentTile: number
    tileIdMap: ClientTileIdMap
    coordsMap: CoordsMap
}) {
    const tile = tileIdMap[currentTile]

    if (tile.coords == undefined) {
        throw new Error("coords missing for current tile")
    }

    const mapMatrix = indicesArray(MAP_DIMENSIONS.y).map((y) =>
        indicesArray(MAP_DIMENSIONS.x).map(
            (x) =>
                coordsMap[
                    [
                        tile.coords![0] - Math.ceil(MAP_DIMENSIONS.x / 2) + x,
                        tile.coords![1] - Math.ceil(MAP_DIMENSIONS.y / 2) + y,
                    ].join(",")
                ],
        ),
    )

    return (
        <div className="faded-edge flex max-h-[100%] items-center justify-center overflow-hidden rounded-lg">
            <div
                className={`grid h-full w-full grid-cols-${MAP_DIMENSIONS.x} gap-3`}
            >
                {mapMatrix.map((row) =>
                    row.map((tileId) => (
                        <div
                            key={tileId}
                            className={"h-24 border border-zinc-500"}
                            style={{
                                background:
                                    tileId === currentTile
                                        ? "var(--accent-8)"
                                        : undefined,
                                borderColor:
                                    tileId !== undefined
                                        ? "var(--accent-8)"
                                        : undefined,
                                borderWidth:
                                    tileId !== undefined ? "2px" : undefined,
                                borderStyle:
                                    tileId !== undefined ? "solid" : "dashed",
                            }}
                        />
                    )),
                )}
            </div>
        </div>
    )
}
