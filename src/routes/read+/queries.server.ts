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
                                    child_events: true,
                                    trigger_lock: true,
                                    trigger_unlock: true,
                                },
                            },
                        },
                    },
                    gates: {
                        with: {
                            locked_by: {
                                with: {
                                    lock: true,
                                },
                            },
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
                    child_events: true,
                    trigger_lock: true,
                    trigger_unlock: true,
                    locked_by: {
                        with: {
                            lock: true,
                        },
                    },
                    grants: true,
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
