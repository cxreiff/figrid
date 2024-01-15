import { redirect, type ActionFunctionArgs } from "@vercel/remix"
import { z } from "zod"
import { auth } from "~/auth/auth.server.ts"
import { db } from "~/database/database.server.ts"
import { gates } from "~/database/schema/gates.server.ts"
import { paramsSchema as gridIdParamsSchema } from "~/routes/write+/+$gridId.tsx"

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
    const user = await auth.isAuthenticated(request)

    if (!user) {
        return redirect("/auth/login")
    }

    const { gridId, resourceId } = paramsSchema
        .merge(gridIdParamsSchema)
        .parse(params)

    const data = JSON.parse(
        z
            .object({ data: z.string() })
            .parse(Object.fromEntries(await request.formData())).data,
    )

    const neighbors = z
        .array(
            z.object({
                type: z.enum(["north", "east", "south", "west", "up", "down"]),
                id: z.number(),
            }),
        )
        .parse(data)

    await db.transaction(async (tx) => {
        for (const neighbor of neighbors) {
            await tx.insert(gates).values({
                user_id: user.id,
                grid_id: gridId,
                from_tile_id: resourceId,
                to_tile_id: neighbor.id,
                type: neighbor.type,
                name: `${resourceId} - ${neighbor.type}`,
            })
            await tx.insert(gates).values({
                user_id: user.id,
                grid_id: gridId,
                from_tile_id: neighbor.id,
                to_tile_id: resourceId,
                type: GATE_TYPE_OPPOSITES[neighbor.type],
                name: `${neighbor.id} - ${GATE_TYPE_OPPOSITES[neighbor.type]}`,
            })
        }
    })

    return redirect(`/write/${gridId}/tiles/${resourceId}`)
}
