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
                    gates: {
                        with: {
                            requirements: {
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
                            character: true,
                        },
                    },
                },
            },
            events: {
                with: {
                    child_events: true,
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
