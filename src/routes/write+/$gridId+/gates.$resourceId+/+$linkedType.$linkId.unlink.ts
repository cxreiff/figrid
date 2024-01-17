import { type ActionFunctionArgs } from "@vercel/remix"
import { and, eq } from "drizzle-orm"
import { z } from "zod"
import { auth } from "~/auth/auth.server.ts"
import { db } from "~/database/database.server.ts"
import { event_instances } from "~/database/schema/events.server.ts"
import { lock_instances } from "~/database/schema/locks.server.ts"
import { paramsSchema as gridIdParamsSchema } from "~/routes/write+/+$gridId.tsx"

const paramsSchema = z.object({
    resourceId: z.coerce.number(),
    linkedType: z.enum(["events", "requirements"]),
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
        case "events":
            await db
                .delete(event_instances)
                .where(
                    and(
                        eq(event_instances.user_id, user.id),
                        eq(event_instances.grid_id, gridId),
                        eq(event_instances.gate_id, resourceId),
                        eq(event_instances.id, linkId),
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
                        eq(lock_instances.gate_id, resourceId),
                        eq(lock_instances.lock_id, linkId),
                    ),
                )
            break
    }

    return new Response(null, { status: 200 })
}
