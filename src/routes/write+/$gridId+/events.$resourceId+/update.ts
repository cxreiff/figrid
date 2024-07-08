import { redirect, type ActionFunctionArgs } from "@vercel/remix"
import { and, eq } from "drizzle-orm"
import { createInsertSchema } from "drizzle-zod"
import { z } from "zod"
import { auth } from "~/auth/auth.server.ts"
import { db } from "~/database/database.server.ts"
import { events } from "~/database/schema/events.server.ts"
import { paramsSchema as parentParamsSchema } from "~/routes/write+/$gridId+/_route.tsx"

const paramsSchema = z.object({
    resourceId: z.coerce.number(),
})

const formSchema = createInsertSchema(events).pick({ trigger: true })

export async function action({ request, params }: ActionFunctionArgs) {
    const user = await auth.isAuthenticated(request, {
        failureRedirect: "/auth/login",
    })

    const { gridId, resourceId } = paramsSchema
        .merge(parentParamsSchema)
        .parse(params)

    const { trigger } = formSchema.parse(
        Object.fromEntries(await request.formData()),
    )

    await db.transaction(async (tx) => {
        await tx
            .update(events)
            .set({ trigger })
            .where(
                and(
                    eq(events.user_id, user.id),
                    eq(events.grid_id, gridId),
                    eq(events.id, resourceId),
                ),
            )
    })

    return redirect(`/write/${gridId}/events/${resourceId}`)
}
