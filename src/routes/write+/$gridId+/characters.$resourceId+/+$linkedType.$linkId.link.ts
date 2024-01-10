import { redirect, type ActionFunctionArgs } from "@vercel/remix"
import { z } from "zod"
import { auth } from "~/auth/auth.server.ts"
import { db } from "~/database/database.server.ts"
import { character_instances } from "~/database/schema/characters.server.ts"
import { event_instances } from "~/database/schema/events.server.ts"
import { paramsSchema as gridIdParamsSchema } from "~/routes/write+/+$gridId.tsx"

const paramsSchema = z.object({
    resourceId: z.coerce.number(),
    linkedType: z.enum(["tiles", "events"]),
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
        case "tiles":
            await db.insert(character_instances).values({
                grid_id: gridId,
                user_id: user.id,
                tile_id: linkId,
                character_id: resourceId,
            })
            break
        case "events":
            await db.insert(event_instances).values({
                grid_id: gridId,
                user_id: user.id,
                event_id: linkId,
                parent_character_id: resourceId,
            })
            break
    }

    return new Response(null, { status: 200 })
}
