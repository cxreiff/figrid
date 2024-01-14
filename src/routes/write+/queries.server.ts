import { eq } from "drizzle-orm"
import { db } from "~/database/database.server.ts"
import { characters } from "~/database/schema/characters.server.ts"
import { events } from "~/database/schema/events.server.ts"
import { gates } from "~/database/schema/gates.server.ts"
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
            tiles: {
                with: {
                    gates_out: {
                        with: {
                            lock_instances: true,
                        },
                    },
                    character_instances: true,
                    item_instances: true,
                },
            },
            characters: true,
            items: true,
            item_instances: true,
            events: true,
            gates: true,
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
            gates_out: {
                with: {
                    lock_instances: true,
                    to_tile: true,
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
                            lock_instances: true,
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
            children: true,
            instances: {
                with: {
                    parent_character: true,
                    parent_tile: true,
                },
            },
            item_instances: {
                with: {
                    item: true,
                },
            },
            triggers_unlock: true,
            triggers_lock: true,
            lock_instances: {
                with: {
                    lock: true,
                },
            },
        },
    })
}

export type WriteGateQuery = NonNullable<
    Awaited<ReturnType<typeof writeGateQuery>>
>

export function writeGateQuery(gateId: number) {
    return db.query.gates.findFirst({
        where: eq(gates.id, gateId),
        with: {
            from_tile: true,
            to_tile: true,
            lock_instances: {
                with: {
                    lock: true,
                },
            },
        },
    })
}

export type WriteLockQuery = NonNullable<
    Awaited<ReturnType<typeof writeLockQuery>>
>

export function writeLockQuery(gateId: number) {
    return db.query.locks.findFirst({
        where: eq(gates.id, gateId),
        with: {
            instances: {
                with: {
                    gate: true,
                    event: true,
                },
            },
            required_item: true,
            unlocking_events: true,
            locking_events: true,
        },
    })
}
