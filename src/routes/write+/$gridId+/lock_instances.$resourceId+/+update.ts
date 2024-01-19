import { type ActionFunctionArgs } from "@vercel/remix"
import { and, eq } from "drizzle-orm"
import { z } from "zod"
import { auth } from "~/auth/auth.server.ts"
import { db } from "~/database/database.server.ts"
import { lock_instances } from "~/database/schema/locks.server.ts"
import { paramsSchema as parentParamsSchema } from "~/routes/write+/+$gridId.tsx"

const paramsSchema = z.object({
    resourceId: z.coerce.number(),
})

const formSchema = z.object({
    inverse: z.enum(["true", "false"]).transform((value) => value === "true"),
    visible: z.enum(["true", "false"]).transform((value) => value === "true"),
})

export async function action({ request, params }: ActionFunctionArgs) {
    const user = await auth.isAuthenticated(request, {
        failureRedirect: "/auth/login",
    })

    const { gridId, resourceId } = paramsSchema
        .merge(parentParamsSchema)
        .parse(params)

    const { inverse, visible } = formSchema.parse(
        Object.fromEntries(await request.formData()),
    )

    await db.transaction(async (tx) => {
        await tx
            .update(lock_instances)
            .set({ inverse, visible })
            .where(
                and(
                    eq(lock_instances.user_id, user.id),
                    eq(lock_instances.grid_id, gridId),
                    eq(lock_instances.id, resourceId),
                ),
            )
    })

    return new Response(null, { status: 200 })
}