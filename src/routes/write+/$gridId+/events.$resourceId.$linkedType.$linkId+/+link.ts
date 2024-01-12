import { redirect, type ActionFunctionArgs } from "@vercel/remix"
import { eq } from "drizzle-orm"
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
        "requirements",
        "unlock",
        "lock",
        "items",
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
                    parent_id: linkId,
                })
                .where(eq(events.id, resourceId))
            break
        case "children":
            await db
                .update(events)
                .set({
                    parent_id: resourceId,
                })
                .where(eq(events.id, linkId))
            break
        case "items":
            await db.insert(item_instances).values({
                grid_id: gridId,
                user_id: user.id,
                item_id: linkId,
                event_id: resourceId,
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
                .where(eq(events.id, resourceId))
            break
        case "lock":
            await db
                .update(events)
                .set({
                    triggers_lock_id: linkId,
                })
                .where(eq(events.id, resourceId))
            break
    }

    return new Response(null, { status: 200 })
}
