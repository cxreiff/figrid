import { type ActionFunctionArgs } from "@vercel/remix"
import { and, eq } from "drizzle-orm"
import { z } from "zod"
import { auth } from "~/auth/auth.server.ts"
import { db } from "~/database/database.server.ts"
import { locks } from "~/database/schema/locks.server.ts"
import { paramsSchema as parentParamsSchema } from "~/routes/write+/$gridId+/_route.tsx"

const paramsSchema = z.object({
    resourceId: z.coerce.number(),
})

const formSchema = z.object({
    consumes: z.enum(["true", "false"]).transform((value) => value === "true"),
})

export async function action({ request, params }: ActionFunctionArgs) {
    const user = await auth.isAuthenticated(request, {
        failureRedirect: "/auth/login",
    })

    const { gridId, resourceId } = paramsSchema
        .merge(parentParamsSchema)
        .parse(params)

    const { consumes } = formSchema.parse(
        Object.fromEntries(await request.formData()),
    )

    await db.transaction(async (tx) => {
        await tx
            .update(locks)
            .set({ consumes })
            .where(
                and(
                    eq(locks.user_id, user.id),
                    eq(locks.grid_id, gridId),
                    eq(locks.id, resourceId),
                ),
            )
    })

    return new Response(null, { status: 200 })
}
