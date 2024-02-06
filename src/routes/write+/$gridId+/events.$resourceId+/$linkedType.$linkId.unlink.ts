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
        "unlock",
        "lock",
        "items",
        "requirements",
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
                    parent_id: null,
                })
                .where(
                    and(
                        eq(events.user_id, user.id),
                        eq(events.grid_id, gridId),
                        eq(events.parent_id, linkId),
                        eq(events.id, resourceId),
                    ),
                )
            break
        case "children":
            await db
                .update(events)
                .set({
                    parent_id: null,
                })
                .where(
                    and(
                        eq(events.user_id, user.id),
                        eq(events.grid_id, gridId),
                        eq(events.parent_id, resourceId),
                        eq(events.id, linkId),
                    ),
                )
            break
        case "unlock":
            await db
                .update(events)
                .set({
                    triggers_unlock_id: null,
                })
                .where(
                    and(
                        eq(events.user_id, user.id),
                        eq(events.grid_id, gridId),
                        eq(events.triggers_unlock_id, linkId),
                        eq(events.id, resourceId),
                    ),
                )
            break
        case "lock":
            await db
                .update(events)
                .set({
                    triggers_lock_id: null,
                })
                .where(
                    and(
                        eq(events.user_id, user.id),
                        eq(events.grid_id, gridId),
                        eq(events.triggers_lock_id, linkId),
                        eq(events.id, resourceId),
                    ),
                )
            break
        case "items":
            await db
                .delete(item_instances)
                .where(
                    and(
                        eq(item_instances.user_id, user.id),
                        eq(item_instances.grid_id, gridId),
                        eq(item_instances.event_id, resourceId),
                        eq(item_instances.item_id, linkId),
                    ),
                )
            break
        case "requirements":
            await db
                .delete(lock_instances)
                .where(
                    and(
                        eq(lock_instances.user_id, user.id),
                        eq(lock_instances.grid_id, gridId),
                        eq(lock_instances.event_id, resourceId),
                        eq(lock_instances.lock_id, linkId),
                    ),
                )
            break
    }

    return new Response(null, { status: 200 })
}
