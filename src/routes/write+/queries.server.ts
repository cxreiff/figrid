import { and, eq } from "drizzle-orm"
import { db } from "~/database/database.server.ts"
import { characters } from "~/database/schema/characters.server.ts"
import { events } from "~/database/schema/events.server.ts"
import { gates } from "~/database/schema/gates.server.ts"
import { grids } from "~/database/schema/grids.server.ts"
import { items } from "~/database/schema/items.server.ts"
import { locks } from "~/database/schema/locks.server.ts"
import { tiles } from "~/database/schema/tiles.server.ts"

export type WriteGridQuery = NonNullable<
    Awaited<ReturnType<typeof writeGridQuery>>
>

export function writeGridQuery(userId: number, gridId: number) {
    return db.query.grids.findFirst({
        where: and(eq(grids.user_id, userId), eq(grids.id, gridId)),
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
            gates: {
                with: {
                    from_tile: true,
                },
            },
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

export function writeTileQuery(userId: number, gridId: number, tileId: number) {
    return db.query.tiles.findFirst({
        where: and(
            eq(tiles.user_id, userId),
            eq(tiles.grid_id, gridId),
            eq(tiles.id, tileId),
        ),
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

export function writeCharacterQuery(
    userId: number,
    gridId: number,
    characterId: number,
) {
    return db.query.characters.findFirst({
        where: and(
            eq(characters.user_id, userId),
            eq(characters.grid_id, gridId),
            eq(characters.id, characterId),
        ),
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

export function writeItemQuery(userId: number, gridId: number, itemId: number) {
    return db.query.items.findFirst({
        where: and(
            eq(items.user_id, userId),
            eq(items.grid_id, gridId),
            eq(items.id, itemId),
        ),
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

export function writeEventQuery(
    userId: number,
    gridId: number,
    eventId: number,
) {
    return db.query.events.findFirst({
        where: and(
            eq(events.user_id, userId),
            eq(events.grid_id, gridId),
            eq(events.id, eventId),
        ),
        with: {
            parent: true,
            children: true,
            instances: {
                with: {
                    character: true,
                    tile: true,
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

export function writeGateQuery(userId: number, gridId: number, gateId: number) {
    return db.query.gates.findFirst({
        where: and(
            eq(gates.user_id, userId),
            eq(gates.grid_id, gridId),
            eq(gates.id, gateId),
        ),
        with: {
            from_tile: true,
            to_tile: true,
            event_instances: {
                with: {
                    event: true,
                },
            },
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

export function writeLockQuery(userId: number, gridId: number, lockId: number) {
    return db.query.locks.findFirst({
        where: and(
            eq(locks.user_id, userId),
            eq(locks.grid_id, gridId),
            eq(locks.id, lockId),
        ),
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
