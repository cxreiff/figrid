import { db } from "~/database/database.server.ts"

export type ListGridsQuery = NonNullable<
    Awaited<ReturnType<typeof listGridsQuery>>
>

export async function listGridsQuery() {
    return await db.query.grids.findMany({
        with: { image_asset: true, user: true },
    })
}
