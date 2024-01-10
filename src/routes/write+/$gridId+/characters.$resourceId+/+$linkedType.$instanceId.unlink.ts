import { redirect, type ActionFunctionArgs } from "@vercel/remix"
import { and, eq } from "drizzle-orm"
import { z } from "zod"
import { auth } from "~/auth/auth.server.ts"
import { db } from "~/database/database.server.ts"
import { character_instances } from "~/database/schema/characters.server.ts"
import { event_instances } from "~/database/schema/events.server.ts"
import { paramsSchema as gridIdParamsSchema } from "~/routes/write+/+$gridId.tsx"

const paramsSchema = z.object({
    resourceId: z.coerce.number(),
    linkedType: z.enum(["tiles", "events"]),
    instanceId: z.coerce.number(),
})

export async function action({ request, params }: ActionFunctionArgs) {
    const { gridId, resourceId, linkedType, instanceId } = paramsSchema
        .merge(gridIdParamsSchema)
        .parse(params)

    const user = await auth.isAuthenticated(request)

    if (!user) {
        return redirect("/auth/login")
    }

    switch (linkedType) {
        case "tiles":
            await db
                .delete(character_instances)
                .where(
                    and(
                        eq(character_instances.grid_id, gridId),
                        eq(character_instances.character_id, resourceId),
                        eq(character_instances.id, instanceId),
                    ),
                )
            break
        case "events":
            await db
                .delete(event_instances)
                .where(
                    and(
                        eq(event_instances.grid_id, gridId),
                        eq(event_instances.parent_character_id, resourceId),
                        eq(event_instances.id, instanceId),
                    ),
                )
            break
    }

    return new Response(null, { status: 200 })
}
