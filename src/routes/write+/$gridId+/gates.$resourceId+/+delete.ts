import { redirect, type ActionFunctionArgs } from "@vercel/remix"
import { and, eq } from "drizzle-orm"
import { z } from "zod"
import { auth } from "~/auth/auth.server.ts"
import { db } from "~/database/database.server.ts"
import { event_instances } from "~/database/schema/events.server.ts"
import { gates } from "~/database/schema/gates.server.ts"
import { lock_instances } from "~/database/schema/locks.server.ts"
import { paramsSchema as parentParamsSchema } from "~/routes/write+/+$gridId.tsx"

const paramsSchema = z.object({
    resourceId: z.coerce.number(),
})

export async function action({ request, params }: ActionFunctionArgs) {
    const user = await auth.isAuthenticated(request, {
        failureRedirect: "/auth/login",
    })

    const { gridId, resourceId } = paramsSchema
        .merge(parentParamsSchema)
        .parse(params)

    await db.transaction(async (tx) => {
        await tx
            .delete(lock_instances)
            .where(
                and(
                    eq(lock_instances.user_id, user.id),
                    eq(lock_instances.grid_id, gridId),
                    eq(lock_instances.gate_id, resourceId),
                ),
            )
        await tx
            .delete(event_instances)
            .where(
                and(
                    eq(event_instances.user_id, user.id),
                    eq(event_instances.grid_id, gridId),
                    eq(event_instances.gate_id, resourceId),
                ),
            )
        await tx
            .update(gates)
            .set({
                active: false,
                summary: null,
                description: null,
            })
            .where(
                and(
                    eq(gates.user_id, user.id),
                    eq(gates.grid_id, gridId),
                    eq(gates.id, resourceId),
                ),
            )
    })

    return redirect(`/write/${gridId}`)
}
