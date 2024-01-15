import { redirect, type ActionFunctionArgs } from "@vercel/remix"
import { and, eq } from "drizzle-orm"
import { z } from "zod"
import { auth } from "~/auth/auth.server.ts"
import { db } from "~/database/database.server.ts"
import { item_instances, items } from "~/database/schema/items.server.ts"
import { locks } from "~/database/schema/locks.server.ts"
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
            .update(locks)
            .set({ required_item_id: null })
            .where(
                and(
                    eq(locks.user_id, user.id),
                    eq(locks.grid_id, gridId),
                    eq(locks.required_item_id, resourceId),
                ),
            )
        await tx
            .delete(item_instances)
            .where(
                and(
                    eq(item_instances.user_id, user.id),
                    eq(item_instances.grid_id, gridId),
                    eq(item_instances.item_id, resourceId),
                ),
            )
        await tx
            .delete(items)
            .where(
                and(
                    eq(items.user_id, user.id),
                    eq(items.grid_id, gridId),
                    eq(items.id, resourceId),
                ),
            )
    })

    return redirect(`/write/${gridId}`)
}
