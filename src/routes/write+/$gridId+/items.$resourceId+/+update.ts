import { type ActionFunctionArgs } from "@vercel/remix"
import { and, eq } from "drizzle-orm"
import { createInsertSchema } from "drizzle-zod"
import { z } from "zod"
import { auth } from "~/auth/auth.server.ts"
import { db } from "~/database/database.server.ts"
import { items } from "~/database/schema/items.server.ts"
import { paramsSchema as parentParamsSchema } from "~/routes/write+/+$gridId.tsx"

const paramsSchema = z.object({
    resourceId: z.coerce.number(),
})

const formSchema = createInsertSchema(items).pick({ type: true })

export async function action({ request, params }: ActionFunctionArgs) {
    const user = await auth.isAuthenticated(request, {
        failureRedirect: "/auth/login",
    })

    const { gridId, resourceId } = paramsSchema
        .merge(parentParamsSchema)
        .parse(params)

    const { type } = formSchema.parse(
        Object.fromEntries(await request.formData()),
    )

    await db.transaction(async (tx) => {
        await tx
            .update(items)
            .set({ type })
            .where(
                and(
                    eq(items.user_id, user.id),
                    eq(items.grid_id, gridId),
                    eq(items.id, resourceId),
                ),
            )
    })

    return new Response(null, { status: 200 })
}
