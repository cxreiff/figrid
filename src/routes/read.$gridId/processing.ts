import type {
    ItemsSelectModel,
    TilesSelectModel,
} from "~/database/schema/grids.server.ts"

type Coords = [number, number, number]
export type TileWithCoords = TilesSelectModel & {
    items: ItemsSelectModel[]
    coords?: Coords
}
export type CoordsMap = Record<string, number | undefined>
export type TileIdMap = Record<string, TileWithCoords>

export function generateTileCoordsMap(tileIdMap: TileIdMap, firstId: number) {
    function generateTileCoordsMapInner(
        tileCoordsMap: CoordsMap,
        tileIdMap: TileIdMap,
        currentId: number,
        currentCoords: Coords,
    ) {
        tileCoordsMap[currentCoords.join(",")] = currentId
        tileIdMap[currentId].coords = currentCoords

        const currentTile = tileIdMap[currentId.toString()]
        for (const [nextId, coordsDiff] of [
            [currentTile.north_id, [0, -1, 0]],
            [currentTile.east_id, [1, 0, 0]],
            [currentTile.south_id, [0, 1, 0]],
            [currentTile.west_id, [-1, 0, 0]],
            [currentTile.up_id, [0, 0, 1]],
            [currentTile.down_id, [0, 0, -1]],
        ] as const) {
            if (nextId === null) {
                continue
            }

            const nextCoords: Coords = [
                currentCoords[0] + coordsDiff[0],
                currentCoords[1] + coordsDiff[1],
                currentCoords[2] + coordsDiff[2],
            ]
            if (tileCoordsMap[nextCoords.join(",")] != undefined) {
                continue
            }

            generateTileCoordsMapInner(
                tileCoordsMap,
                tileIdMap,
                nextId,
                nextCoords,
            )
        }
    }

    const tileCoordsMap: CoordsMap = {}
    generateTileCoordsMapInner(tileCoordsMap, tileIdMap, firstId, [0, 0, 0])

    return tileCoordsMap
}
