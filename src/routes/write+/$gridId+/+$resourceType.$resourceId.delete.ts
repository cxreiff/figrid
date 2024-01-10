import { redirect, type ActionFunctionArgs } from "@vercel/remix"
import { and, eq } from "drizzle-orm"
import { db } from "~/database/database.server.ts"
import { characters } from "~/database/schema/characters.server.ts"
import { events } from "~/database/schema/events.server.ts"
import { items } from "~/database/schema/items.server.ts"
import { tiles } from "~/database/schema/tiles.server.ts"
import { paramsSchema } from "~/routes/write+/$gridId+/+$resourceType.$resourceId.tsx"
import { paramsSchema as parentParamsSchema } from "~/routes/write+/+$gridId.tsx"

export async function action({ params }: ActionFunctionArgs) {
    const { gridId, resourceType, resourceId } = paramsSchema
        .merge(parentParamsSchema)
        .parse(params)

    switch (resourceType) {
        case "tiles":
            await db
                .delete(tiles)
                .where(and(eq(tiles.id, resourceId), eq(tiles.grid_id, gridId)))
            break
        case "characters":
            await db
                .delete(characters)
                .where(
                    and(
                        eq(characters.id, resourceId),
                        eq(characters.grid_id, gridId),
                    ),
                )
            break
        case "items":
            await db
                .delete(items)
                .where(and(eq(items.id, resourceId), eq(items.grid_id, gridId)))
            break
        case "events":
            await db
                .delete(events)
                .where(
                    and(eq(events.id, resourceId), eq(events.grid_id, gridId)),
                )
            break
    }

    return redirect(`/write/${gridId}`)
}
