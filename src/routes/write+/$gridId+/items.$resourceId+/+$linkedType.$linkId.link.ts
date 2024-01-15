import { type ActionFunctionArgs } from "@vercel/remix"
import { z } from "zod"
import { auth } from "~/auth/auth.server.ts"
import { db } from "~/database/database.server.ts"
import { item_instances } from "~/database/schema/items.server.ts"
import { paramsSchema as gridIdParamsSchema } from "~/routes/write+/+$gridId.tsx"

const paramsSchema = z.object({
    resourceId: z.coerce.number(),
    linkedType: z.enum(["tiles", "events"]),
    linkId: z.coerce.number(),
})

export async function action({ request, params }: ActionFunctionArgs) {
    const user = await auth.isAuthenticated(request, {
        failureRedirect: "/auth/login",
    })

    const { gridId, resourceId, linkedType, linkId } = paramsSchema
        .merge(gridIdParamsSchema)
        .parse(params)

    switch (linkedType) {
        case "tiles":
            await db.insert(item_instances).values({
                user_id: user.id,
                grid_id: gridId,
                item_id: resourceId,
                tile_id: linkId,
            })
            break
        case "events":
            await db.insert(item_instances).values({
                user_id: user.id,
                grid_id: gridId,
                item_id: resourceId,
                event_id: linkId,
            })
            break
    }

    return new Response(null, { status: 200 })
}
