import { redirect, type ActionFunctionArgs } from "@vercel/remix"
import { and, eq } from "drizzle-orm"
import { z } from "zod"
import { auth } from "~/auth/auth.server.ts"
import { db } from "~/database/database.server.ts"
import { events } from "~/database/schema/events.server.ts"
import { lock_instances, locks } from "~/database/schema/locks.server.ts"
import { paramsSchema as parentParamsSchema } from "~/routes/write+/$gridId+/_route.tsx"

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
            .update(events)
            .set({ triggers_unlock_id: null })
            .where(
                and(
                    eq(events.user_id, user.id),
                    eq(events.grid_id, gridId),
                    eq(events.triggers_unlock_id, resourceId),
                ),
            )
        await tx
            .update(events)
            .set({ triggers_lock_id: null })
            .where(
                and(
                    eq(events.user_id, user.id),
                    eq(events.grid_id, gridId),
                    eq(events.triggers_lock_id, resourceId),
                ),
            )
        await tx
            .delete(lock_instances)
            .where(
                and(
                    eq(lock_instances.user_id, user.id),
                    eq(lock_instances.grid_id, gridId),
                    eq(lock_instances.lock_id, resourceId),
                ),
            )
        await tx
            .delete(locks)
            .where(
                and(
                    eq(locks.user_id, user.id),
                    eq(locks.grid_id, gridId),
                    eq(locks.id, resourceId),
                ),
            )
    })

    return redirect(`/write/${gridId}`)
}
