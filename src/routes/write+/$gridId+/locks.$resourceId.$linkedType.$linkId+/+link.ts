import { redirect, type ActionFunctionArgs } from "@vercel/remix"
import { z } from "zod"
import { auth } from "~/auth/auth.server.ts"
import { db } from "~/database/database.server.ts"
import { lock_instances } from "~/database/schema/locks.server.ts"
import { paramsSchema as gridIdParamsSchema } from "~/routes/write+/+$gridId.tsx"

const paramsSchema = z.object({
    resourceId: z.coerce.number(),
    linkedType: z.enum(["events", "gates"]),
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
        case "events":
            await db.insert(lock_instances).values({
                grid_id: gridId,
                user_id: user.id,
                lock_id: resourceId,
                event_id: linkId,
            })
            break
        case "gates":
            await db.insert(lock_instances).values({
                grid_id: gridId,
                user_id: user.id,
                lock_id: resourceId,
                gate_id: linkId,
            })
            break
    }

    return new Response(null, { status: 200 })
}