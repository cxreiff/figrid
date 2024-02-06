import { redirect, type ActionFunctionArgs } from "@vercel/remix"
import { and, eq } from "drizzle-orm"
import { z } from "zod"
import { auth } from "~/auth/auth.server.ts"
import { db } from "~/database/database.server.ts"
import {
    character_instances,
    characters,
} from "~/database/schema/characters.server.ts"
import { event_instances } from "~/database/schema/events.server.ts"
import { paramsSchema as parentParamsSchema } from "~/routes/write+/$gridId+/_route.tsx"

const paramsSchema = z.object({
    resourceId: z.coerce.number(),
})

export async function action({ request, params }: ActionFunctionArgs) {
    const user = await auth.isAuthenticated(request, {
        failureRedirect: "/auth/login",
    })

    const { gridId, resourceId } = paramsSchema
        .merge(parentParamsSchema)
        .parse(params)

    await db.transaction(async (tx) => {
        await tx
            .delete(event_instances)
            .where(
                and(
                    eq(event_instances.user_id, user.id),
                    eq(event_instances.grid_id, gridId),
                    eq(event_instances.character_id, resourceId),
                ),
            )
        await tx
            .delete(character_instances)
            .where(
                and(
                    eq(character_instances.user_id, user.id),
                    eq(character_instances.grid_id, gridId),
                    eq(character_instances.character_id, resourceId),
                ),
            )
        await tx
            .delete(characters)
            .where(
                and(
                    eq(characters.user_id, user.id),
                    eq(characters.grid_id, gridId),
                    eq(characters.id, resourceId),
                ),
            )
    })

    return redirect(`/write/${gridId}`)
}
