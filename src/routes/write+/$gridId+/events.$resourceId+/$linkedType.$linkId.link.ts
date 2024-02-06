import { type ActionFunctionArgs } from "@vercel/remix"
import { and, eq } from "drizzle-orm"
import { z } from "zod"
import { auth } from "~/auth/auth.server.ts"
import { db } from "~/database/database.server.ts"
import { events } from "~/database/schema/events.server.ts"
import { item_instances } from "~/database/schema/items.server.ts"
import { lock_instances } from "~/database/schema/locks.server.ts"
import { paramsSchema as gridIdParamsSchema } from "~/routes/write+/$gridId+/_route.tsx"

const paramsSchema = z.object({
    resourceId: z.coerce.number(),
    linkedType: z.enum([
        "parent",
        "children",
        "requirements",
        "unlock",
        "lock",
        "items",
    ]),
    linkId: z.coerce.number(),
})

export async function action({ request, params }: ActionFunctionArgs) {
    const user = await auth.isAuthenticated(request, {
        failureRedirect: "/auth/login",
    })

    const { gridId, resourceId, linkedType, linkId } = paramsSchema
        .merge(gridIdParamsSchema)
        .parse(params)

    switch (linkedType) {
        case "parent":
            await db
                .update(events)
                .set({
                    parent_id: linkId,
                })
                .where(
                    and(
                        eq(events.user_id, user.id),
                        eq(events.grid_id, gridId),
                        eq(events.id, resourceId),
                    ),
                )
            break
        case "children":
            await db
                .update(events)
                .set({
                    parent_id: resourceId,
                })
                .where(
                    and(
                        eq(events.user_id, user.id),
                        eq(events.grid_id, gridId),
                        eq(events.id, linkId),
                    ),
                )
            break
        case "items":
            await db.insert(item_instances).values({
                user_id: user.id,
                grid_id: gridId,
                event_id: resourceId,
                item_id: linkId,
            })
            break
        case "requirements":
            await db.insert(lock_instances).values({
                user_id: user.id,
                grid_id: gridId,
                event_id: resourceId,
                lock_id: linkId,
            })
            break
        case "unlock":
            await db
                .update(events)
                .set({
                    triggers_unlock_id: linkId,
                })
                .where(
                    and(
                        eq(events.user_id, user.id),
                        eq(events.grid_id, gridId),
                        eq(events.id, resourceId),
                    ),
                )
            break
        case "lock":
            await db
                .update(events)
                .set({
                    triggers_lock_id: linkId,
                })
                .where(
                    and(
                        eq(events.user_id, user.id),
                        eq(events.grid_id, gridId),
                        eq(events.id, resourceId),
                    ),
                )
            break
    }

    return new Response(null, { status: 200 })
}
