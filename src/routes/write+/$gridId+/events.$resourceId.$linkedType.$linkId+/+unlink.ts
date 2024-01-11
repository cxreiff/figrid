import { redirect, type ActionFunctionArgs } from "@vercel/remix"
import { and, eq } from "drizzle-orm"
import { z } from "zod"
import { auth } from "~/auth/auth.server.ts"
import { db } from "~/database/database.server.ts"
import { events } from "~/database/schema/events.server.ts"
import { item_instances } from "~/database/schema/items.server.ts"
import { lock_instances } from "~/database/schema/locks.server.ts"
import { paramsSchema as gridIdParamsSchema } from "~/routes/write+/+$gridId.tsx"

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
    const { gridId, resourceId, linkedType, linkId } = paramsSchema
        .merge(gridIdParamsSchema)
        .parse(params)

    const user = await auth.isAuthenticated(request)

    if (!user) {
        return redirect("/auth/login")
    }

    switch (linkedType) {
        case "parent":
            await db
                .update(events)
                .set({
                    parent_id: null,
                })
                .where(
                    and(
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
                    trigger_unlock_id: null,
                })
                .where(
                    and(
                        eq(events.grid_id, gridId),
                        eq(events.trigger_unlock_id, linkId),
                        eq(events.id, resourceId),
                    ),
                )
            break
        case "lock":
            await db
                .update(events)
                .set({
                    trigger_lock_id: null,
                })
                .where(
                    and(
                        eq(events.grid_id, gridId),
                        eq(events.trigger_lock_id, linkId),
                        eq(events.id, resourceId),
                    ),
                )
            break
        case "items":
            await db
                .delete(item_instances)
                .where(
                    and(
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
                        eq(lock_instances.grid_id, gridId),
                        eq(lock_instances.event_id, resourceId),
                        eq(lock_instances.lock_id, linkId),
                    ),
                )
            break
    }

    return new Response(null, { status: 200 })
}
