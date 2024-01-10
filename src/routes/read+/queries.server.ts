import { eq } from "drizzle-orm"
import { db } from "~/database/database.server.ts"
import { grids } from "~/database/schema/grids.server.ts"

export type GridQuery = NonNullable<Awaited<ReturnType<typeof gridQuery>>>

export function gridQuery(gridId: number) {
    return db.query.grids.findFirst({
        where: eq(grids.id, gridId),
        with: {
            tiles: {
                with: {
                    event_instances: {
                        with: {
                            event: {
                                with: {
                                    unlocks_locks: true,
                                    locks_locks: true,
                                    child_events: true,
                                },
                            },
                        },
                    },
                    gates: {
                        with: {
                            requirements: true,
                        },
                    },
                    item_instances: {
                        with: {
                            item: true,
                        },
                    },
                    character_instances: {
                        with: {
                            character: {
                                with: {
                                    event_instances: {
                                        with: {
                                            event: true,
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            },
            events: {
                with: {
                    unlocks_locks: true,
                    locks_locks: true,
                    child_events: true,
                    requirements: true,
                },
            },
            items: true,
            item_instances: {
                with: {
                    item: true,
                },
            },
            player: true,
        },
    })
}
