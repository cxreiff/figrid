import type { GridQuery } from "~/routes/read.$gridId/query.server.ts"

type Coords = [number, number, number]
export type CoordsMap = Record<string, number | undefined>
export type IdMap<T extends { id: number }> = Record<string, T>
export type TileWithCoords = GridQuery["tiles"][0] & { coords?: Coords }

export function generateIdMap<T extends { id: number }>(elements: T[]) {
    return Object.fromEntries(elements.map((element) => [element.id, element]))
}

export function generateTileCoordsMap(
    tileIdMap: IdMap<TileWithCoords>,
    firstId: number,
) {
    function generateTileCoordsMapInner(
        tileCoordsMap: CoordsMap,
        tileIdMap: IdMap<TileWithCoords>,
        currentId: number,
        currentCoords: Coords,
    ) {
        tileCoordsMap[currentCoords.join(",")] = currentId
        tileIdMap[currentId].coords = currentCoords

        const currentTile = tileIdMap[currentId.toString()]
        const adjacents = currentTile.gates.map(
            ({ to_id, type }) =>
                [
                    to_id,
                    {
                        north: [0, -1, 0] as const,
                        east: [1, 0, 0] as const,
                        south: [0, 1, 0] as const,
                        west: [-1, 0, 0] as const,
                        up: [0, 0, 1] as const,
                        down: [0, 0, -1] as const,
                        other: null,
                    }[type],
                ] as const,
        )

        for (const [nextId, coordsDiff] of adjacents) {
            if (coordsDiff === null) {
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
