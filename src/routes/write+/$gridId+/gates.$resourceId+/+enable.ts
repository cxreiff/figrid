import { redirect, type ActionFunctionArgs } from "@vercel/remix"
import { and, eq } from "drizzle-orm"
import { z } from "zod"
import { auth } from "~/auth/auth.server.ts"
import { db } from "~/database/database.server.ts"
import { gates } from "~/database/schema/gates.server.ts"
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
            .update(gates)
            .set({
                active: true,
            })
            .where(
                and(
                    eq(gates.user_id, user.id),
                    eq(gates.grid_id, gridId),
                    eq(gates.id, resourceId),
                ),
            )
    })

    return redirect(`/write/${gridId}/gates/${resourceId}`)
}
