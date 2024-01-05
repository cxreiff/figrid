import { eq } from "drizzle-orm"
import { db } from "~/database/database.server.ts"
import { grids } from "~/database/schema/grids.server.ts"

export type WriteGridQuery = NonNullable<
    Awaited<ReturnType<typeof writeGridQuery>>
>

export function writeGridQuery(gridId: number) {
    return db.query.grids.findFirst({
        where: eq(grids.id, gridId),
        with: {
            tiles: true,
        },
    })
}
