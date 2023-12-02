import { useState } from "react"
import { useLoaderData } from "@remix-run/react"
import { json, type LoaderFunctionArgs } from "@vercel/remix"
import { db } from "~/database/database.server.ts"
import { eq, type InferSelectModel } from "drizzle-orm"
import { z } from "zod"
import {
    grids,
    tiles,
    type TilesSelectModel,
} from "~/database/schema/grids.server.ts"
import { auth } from "~/auth/auth.server.ts"
import { Layout } from "~/components/layout.tsx"
import { Text } from "~/routes/read.$gridId/text.tsx"
import { Map } from "~/routes/read.$gridId/map.tsx"
import { Info } from "~/routes/read.$gridId/info.tsx"

type Coords = [number, number]
export type CoordsMap = Record<string, number | undefined>
export type TileIdMap = Record<
    string,
    InferSelectModel<typeof tiles> & { coords?: Coords }
>
export type ClientTileIdMap = Record<
    string,
    TilesSelectModel & { coords?: Coords }
>
type MinMax = { min: Coords; max: Coords }

const paramsSchema = z.object({ gridId: z.coerce.number() })

export async function loader({ request, params }: LoaderFunctionArgs) {
    const { gridId } = paramsSchema.parse(params)

    const [grid] = await db.select().from(grids).where(eq(grids.id, gridId))
    const gridTiles = await db
        .select()
        .from(tiles)
        .where(eq(tiles.grid_id, gridId))

    const tileIdMap = Object.fromEntries(
        gridTiles.map((tile) => [tile.id, tile]),
    )

    const tileCoordsMap = generateTileCoordsMap(tileIdMap, grid.first_id)

    const user = await auth.isAuthenticated(request)

    return json({ user, grid, tileIdMap, tileCoordsMap })
}

function generateTileCoordsMap(tileIdMap: TileIdMap, firstId: number) {
    function generateTileCoordsMapInner(
        tileCoordsMap: CoordsMap,
        minMax: MinMax,
        tileIdMap: TileIdMap,
        currentId: number,
        currentCoords: Coords,
    ) {
        tileCoordsMap[currentCoords.join(",")] = currentId
        tileIdMap[currentId].coords = currentCoords
        minMax.min = [
            Math.min(minMax.min[0], currentCoords[0]),
            Math.min(minMax.min[1], currentCoords[1]),
        ]
        minMax.max = [
            Math.max(minMax.max[0], currentCoords[0]),
            Math.max(minMax.max[1], currentCoords[1]),
        ]

        const currentTile = tileIdMap[currentId.toString()]
        for (const [nextId, coordsDiff] of [
            [currentTile.north_id, [0, -1]],
            [currentTile.east_id, [1, 0]],
            [currentTile.south_id, [0, 1]],
            [currentTile.west_id, [-1, 0]],
        ] as const) {
            if (nextId === null) {
                continue
            }

            const nextCoords: Coords = [
                currentCoords[0] + coordsDiff[0],
                currentCoords[1] + coordsDiff[1],
            ]
            if (tileCoordsMap[nextCoords.join(",")] != undefined) {
                continue
            }

            generateTileCoordsMapInner(
                tileCoordsMap,
                minMax,
                tileIdMap,
                nextId,
                nextCoords,
            )
        }
    }

    const tileCoordsMap: CoordsMap = {}
    const minMax: MinMax = {
        min: [Number.MAX_SAFE_INTEGER, Number.MIN_SAFE_INTEGER],
        max: [Number.MIN_SAFE_INTEGER, Number.MIN_SAFE_INTEGER],
    }
    generateTileCoordsMapInner(
        tileCoordsMap,
        minMax,
        tileIdMap,
        firstId,
        [0, 0],
    )
    return tileCoordsMap
}

export default function Tile() {
    const { user, grid, tileIdMap, tileCoordsMap } =
        useLoaderData<typeof loader>()

    const [currentTile, setCurrentTile] = useState(grid.first_id)

    const tile = tileIdMap[currentTile]

    function handleCommand(command: string, tile: TilesSelectModel) {
        switch (command) {
            case "go north":
                if (tile.north_id) {
                    setCurrentTile(tile.north_id)
                } else {
                    return "there is no passage in that direction"
                }
                break
            case "go east":
                if (tile.east_id) {
                    setCurrentTile(tile.east_id)
                } else {
                    return "there is no passage in that direction"
                }
                break
            case "go south":
                if (tile.south_id) {
                    setCurrentTile(tile.south_id)
                } else {
                    return "there is no passage in that direction"
                }
                break
            case "go west":
                if (tile.west_id) {
                    setCurrentTile(tile.west_id)
                } else {
                    return "there is no passage in that direction"
                }
                break
            default:
                return "i did not understand that"
        }
        return ""
    }

    return (
        <Layout
            user={user}
            title={`${grid.name} — ${tile.name}`}
            left={<Info />}
            right={
                <Map
                    currentTile={currentTile}
                    tileIdMap={tileIdMap}
                    coordsMap={tileCoordsMap}
                />
            }
            center={
                <Text
                    tile={tile}
                    handleCommand={(command) => handleCommand(command, tile)}
                />
            }
        />
    )
}
