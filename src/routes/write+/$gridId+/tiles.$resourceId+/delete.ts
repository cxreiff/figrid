import { redirect, type ActionFunctionArgs } from "@vercel/remix"
import { and, eq, inArray, or } from "drizzle-orm"
import { z } from "zod"
import { auth } from "~/auth/auth.server.ts"
import { db } from "~/database/database.server.ts"
import { character_instances } from "~/database/schema/characters.server.ts"
import { event_instances } from "~/database/schema/events.server.ts"
import { gates } from "~/database/schema/gates.server.ts"
import { item_instances } from "~/database/schema/items.server.ts"
import { lock_instances } from "~/database/schema/locks.server.ts"
import { tiles } from "~/database/schema/tiles.server.ts"
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

    const gatesAdjacentToTileCondition = and(
        eq(gates.user_id, user.id),
        eq(gates.grid_id, gridId),
        or(
            eq(gates.from_tile_id, resourceId),
            eq(gates.to_tile_id, resourceId),
        ),
    )

    await db.transaction(async (tx) => {
        await db
            .delete(lock_instances)
            .where(
                and(
                    eq(lock_instances.user_id, user.id),
                    eq(lock_instances.grid_id, gridId),
                    inArray(
                        lock_instances.gate_id,
                        db
                            .select({ id: gates.id })
                            .from(gates)
                            .where(gatesAdjacentToTileCondition),
                    ),
                ),
            )
        await db
            .delete(event_instances)
            .where(
                and(
                    eq(event_instances.user_id, user.id),
                    eq(event_instances.grid_id, gridId),
                    inArray(
                        event_instances.gate_id,
                        db
                            .select({ id: gates.id })
                            .from(gates)
                            .where(gatesAdjacentToTileCondition),
                    ),
                ),
            )
        await tx.delete(gates).where(gatesAdjacentToTileCondition)
        await tx
            .delete(lock_instances)
            .where(
                and(
                    eq(lock_instances.user_id, user.id),
                    eq(lock_instances.grid_id, gridId),
                    eq(lock_instances.gate_id, resourceId),
                ),
            )
        await tx
            .delete(character_instances)
            .where(
                and(
                    eq(character_instances.user_id, user.id),
                    eq(character_instances.grid_id, gridId),
                    eq(character_instances.tile_id, resourceId),
                ),
            )
        await tx
            .delete(event_instances)
            .where(
                and(
                    eq(event_instances.user_id, user.id),
                    eq(event_instances.grid_id, gridId),
                    eq(event_instances.tile_id, resourceId),
                ),
            )
        await tx
            .delete(item_instances)
            .where(
                and(
                    eq(item_instances.user_id, user.id),
                    eq(item_instances.grid_id, gridId),
                    eq(item_instances.tile_id, resourceId),
                ),
            )
        await tx
            .delete(tiles)
            .where(
                and(
                    eq(tiles.user_id, user.id),
                    eq(tiles.grid_id, gridId),
                    eq(tiles.id, resourceId),
                ),
            )
    })

    return redirect(`/write/${gridId}`)
}
