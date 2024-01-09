import { eq } from "drizzle-orm"
import { db } from "~/database/database.server.ts"
import { grids, tiles } from "~/database/schema/grids.server.ts"

export type WriteGridQuery = NonNullable<
    Awaited<ReturnType<typeof writeGridQuery>>
>

export function writeGridQuery(gridId: number) {
    return db.query.grids.findFirst({
        where: eq(grids.id, gridId),
        with: {
            tiles: true,
            characters: true,
            items: true,
            events: true,
        },
    })
}

export type WriteTileQuery = NonNullable<
    Awaited<ReturnType<typeof writeTileQuery>>
>

export function writeTileQuery(tileId: number) {
    return db.query.tiles.findFirst({
        where: eq(tiles.id, tileId),
        with: {
            item_instances: {
                with: {
                    item: true,
                },
            },
            gates: {
                with: {
                    requirements: true,
                    to: true,
                },
            },
        },
    })
}
