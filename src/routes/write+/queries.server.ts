import { eq } from "drizzle-orm"
import { db } from "~/database/database.server.ts"
import { characters } from "~/database/schema/characters.server.ts"
import { events } from "~/database/schema/events.server.ts"
import { grids } from "~/database/schema/grids.server.ts"
import { items } from "~/database/schema/items.server.ts"
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
            locks: {
                with: {
                    instances: true,
                },
            },
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
                    locked_by: true,
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
                            locked_by: true,
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

export type WriteItemQuery = NonNullable<
    Awaited<ReturnType<typeof writeItemQuery>>
>

export function writeItemQuery(itemId: number) {
    return db.query.items.findFirst({
        where: eq(items.id, itemId),
        with: {
            instances: {
                with: {
                    tile: true,
                    event: true,
                },
            },
        },
    })
}

export type WriteEventQuery = NonNullable<
    Awaited<ReturnType<typeof writeEventQuery>>
>

export function writeEventQuery(eventId: number) {
    return db.query.events.findFirst({
        where: eq(events.id, eventId),
        with: {
            parent: true,
            child_events: true,
            instances: {
                with: {
                    parent_character: true,
                    parent_tile: true,
                },
            },
            grants: {
                with: {
                    item: true,
                },
            },
            trigger_unlock: true,
            trigger_lock: true,
            locked_by: {
                with: {
                    lock: true,
                },
            },
        },
    })
}
