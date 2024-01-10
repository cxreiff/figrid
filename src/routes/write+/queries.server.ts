import { eq } from "drizzle-orm"
import { db } from "~/database/database.server.ts"
import { characters } from "~/database/schema/characters.server.ts"
import { grids } from "~/database/schema/grids.server.ts"
import { tiles } from "~/database/schema/tiles.server.ts"

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
            gates: {
                with: {
                    requirements: true,
                    to: true,
                },
            },
            character_instances: {
                with: {
                    character: true,
                },
            },
            item_instances: {
                with: {
                    item: true,
                },
            },
            event_instances: {
                with: {
                    event: {
                        with: {
                            requirements: true,
                        },
                    },
                },
            },
        },
    })
}

export type WriteCharacterQuery = NonNullable<
    Awaited<ReturnType<typeof writeCharacterQuery>>
>

export function writeCharacterQuery(characterId: number) {
    return db.query.characters.findFirst({
        where: eq(characters.id, characterId),
        with: {
            instances: {
                with: {
                    tile: true,
                },
            },
            event_instances: {
                with: {
                    event: true,
                },
            },
        },
    })
}
