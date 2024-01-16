import { redirect, type ActionFunctionArgs } from "@vercel/remix"
import { and, eq } from "drizzle-orm"
import { z } from "zod"
import { auth } from "~/auth/auth.server.ts"
import { db } from "~/database/database.server.ts"
import { lock_instances, locks } from "~/database/schema/locks.server.ts"
import { paramsSchema as gridIdParamsSchema } from "~/routes/write+/+$gridId.tsx"

const paramsSchema = z.object({
    resourceId: z.coerce.number(),
    linkedType: z.enum(["item", "events", "gates"]),
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
        case "item":
            await db
                .update(locks)
                .set({ required_item_id: null })
                .where(
                    and(
                        eq(locks.user_id, user.id),
                        eq(locks.grid_id, gridId),
                        eq(locks.id, resourceId),
                        eq(locks.required_item_id, linkId),
                    ),
                )
            break
        case "events":
            await db
                .delete(lock_instances)
                .where(
                    and(
                        eq(lock_instances.grid_id, gridId),
                        eq(lock_instances.lock_id, resourceId),
                        eq(lock_instances.gate_id, linkId),
                    ),
                )
            break
        case "gates":
            await db
                .delete(lock_instances)
                .where(
                    and(
                        eq(lock_instances.grid_id, gridId),
                        eq(lock_instances.lock_id, resourceId),
                        eq(lock_instances.gate_id, linkId),
                    ),
                )
            break
    }

    return new Response(null, { status: 200 })
}
