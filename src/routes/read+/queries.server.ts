import { eq } from "drizzle-orm"
import { db } from "~/database/database.server.ts"
import { gates } from "~/database/schema/gates.server.ts"
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
                                    children: true,
                                    triggers_lock: true,
                                    triggers_unlock: true,
                                },
                            },
                        },
                    },
                    gates_out: {
                        with: {
                            event_instances: {
                                with: {
                                    event: {
                                        with: {
                                            lock_instances: true,
                                        },
                                    },
                                },
                            },
                            lock_instances: {
                                with: {
                                    gate: true,
                                    lock: {
                                        with: {
                                            required_item: true,
                                        },
                                    },
                                },
                            },
                        },
                        where: eq(gates.active, true),
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
                    children: true,
                    triggers_lock: true,
                    triggers_unlock: true,
                    lock_instances: {
                        with: {
                            lock: {
                                with: {
                                    required_item: true,
                                },
                            },
                        },
                    },
                    item_instances: true,
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
