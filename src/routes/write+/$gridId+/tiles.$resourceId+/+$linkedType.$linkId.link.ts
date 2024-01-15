import { type ActionFunctionArgs } from "@vercel/remix"
import { z } from "zod"
import { auth } from "~/auth/auth.server.ts"
import { db } from "~/database/database.server.ts"
import { character_instances } from "~/database/schema/characters.server.ts"
import { event_instances } from "~/database/schema/events.server.ts"
import { item_instances } from "~/database/schema/items.server.ts"
import { paramsSchema as parentParamsSchema } from "~/routes/write+/+$gridId.tsx"

const paramsSchema = z.object({
    resourceId: z.coerce.number(),
    linkedType: z.enum(["characters", "items", "events"]),
    linkId: z.coerce.number(),
})

export async function action({ request, params }: ActionFunctionArgs) {
    const user = await auth.isAuthenticated(request, {
        failureRedirect: "/auth/login",
    })

    const { gridId, resourceId, linkedType, linkId } = paramsSchema
        .merge(parentParamsSchema)
        .parse(params)

    switch (linkedType) {
        case "characters":
            await db.insert(character_instances).values({
                user_id: user.id,
                grid_id: gridId,
                tile_id: resourceId,
                character_id: linkId,
            })
            break
        case "items":
            await db.insert(item_instances).values({
                user_id: user.id,
                grid_id: gridId,
                tile_id: resourceId,
                item_id: linkId,
            })
            break
        case "events":
            await db.insert(event_instances).values({
                user_id: user.id,
                grid_id: gridId,
                tile_id: resourceId,
                event_id: linkId,
            })
            break
    }

    return new Response(null, { status: 200 })
}
