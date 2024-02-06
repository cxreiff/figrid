import { type ActionFunctionArgs } from "@vercel/remix"
import { and, eq } from "drizzle-orm"
import { z } from "zod"
import { auth } from "~/auth/auth.server.ts"
import { db } from "~/database/database.server.ts"
import { character_instances } from "~/database/schema/characters.server.ts"
import { event_instances } from "~/database/schema/events.server.ts"
import { paramsSchema as gridIdParamsSchema } from "~/routes/write+/$gridId+/_route.tsx"

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
            await db
                .delete(character_instances)
                .where(
                    and(
                        eq(character_instances.user_id, user.id),
                        eq(character_instances.grid_id, gridId),
                        eq(character_instances.character_id, resourceId),
                        eq(character_instances.id, linkId),
                    ),
                )
            break
        case "events":
            await db
                .delete(event_instances)
                .where(
                    and(
                        eq(event_instances.user_id, user.id),
                        eq(event_instances.grid_id, gridId),
                        eq(event_instances.character_id, resourceId),
                        eq(event_instances.id, linkId),
                    ),
                )
            break
    }

    return new Response(null, { status: 200 })
}
