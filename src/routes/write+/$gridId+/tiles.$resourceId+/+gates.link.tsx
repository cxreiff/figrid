import { redirect, type ActionFunctionArgs } from "@vercel/remix"
import { and, eq, inArray } from "drizzle-orm"
import { z } from "zod"
import { auth } from "~/auth/auth.server.ts"
import { db } from "~/database/database.server.ts"
import { gates } from "~/database/schema/gates.server.ts"
import { tiles } from "~/database/schema/tiles.server.ts"
import { defined, strictEntries } from "~/lib/misc.ts"
import { zodSearchParams } from "~/lib/parsers.ts"
import { paramsSchema as parentParamsSchema } from "~/routes/write+/+$gridId.tsx"

const GATE_TYPE_OPPOSITES: Record<
    typeof gates.$inferSelect.type,
    typeof gates.$inferSelect.type
> = {
    north: "south",
    east: "west",
    south: "north",
    west: "east",
    up: "down",
    down: "up",
    other: "other",
}

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

    const neighbors = strictEntries(
        zodSearchParams(
            request.url,
            z.object({
                north: z.coerce.number().optional(),
                east: z.coerce.number().optional(),
                south: z.coerce.number().optional(),
                west: z.coerce.number().optional(),
                up: z.coerce.number().optional(),
                down: z.coerce.number().optional(),
            }),
        ),
    ).map(([type, id]) => ({ type, id }))

    await db.transaction(async (tx) => {
        const tile = await db.query.tiles.findFirst({
            where: and(
                eq(tiles.user_id, user.id),
                eq(tiles.grid_id, gridId),
                eq(tiles.id, resourceId),
            ),
        })

        if (!tile) {
            throw new Response(null, { status: 404 })
        }

        const neighborTiles = await db
            .select({ id: tiles.id, name: tiles.name })
            .from(tiles)
            .where(
                and(
                    eq(tiles.user_id, user.id),
                    eq(tiles.grid_id, gridId),
                    inArray(
                        tiles.id,
                        neighbors.map(({ id }) => id).filter(defined),
                    ),
                ),
            )

        const neighborNameMap = neighborTiles.reduce<Record<number, string>>(
            (prev, { id, name }) => ({ ...prev, [id]: name }),
            {},
        )

        for (const neighbor of neighbors) {
            if (!neighbor.id) {
                continue
            }

            await tx.insert(gates).values([
                {
                    user_id: user.id,
                    grid_id: gridId,
                    from_tile_id: resourceId,
                    to_tile_id: neighbor.id,
                    type: neighbor.type,
                    name: `${tile.name} - ${neighbor.type}`,
                },
                {
                    user_id: user.id,
                    grid_id: gridId,
                    from_tile_id: neighbor.id,
                    to_tile_id: resourceId,
                    type: GATE_TYPE_OPPOSITES[neighbor.type],
                    name: `${neighborNameMap[neighbor.id]} - ${
                        GATE_TYPE_OPPOSITES[neighbor.type]
                    }`,
                },
            ])
        }
    })

    return redirect(`/write/${gridId}/tiles/${resourceId}`)
}
