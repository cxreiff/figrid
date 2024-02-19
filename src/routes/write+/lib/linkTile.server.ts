import { z } from "zod"
import type { AuthUser } from "~/auth/auth.server.ts"
import { db } from "~/database/database.server.ts"
import { gates } from "~/database/schema/gates.server.ts"
import { strictEntries } from "~/lib/misc.ts"
import { zodSearchParams } from "~/lib/parsers.ts"

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

const neighborsSchema = z.object({
    north: z.coerce.number().optional(),
    east: z.coerce.number().optional(),
    south: z.coerce.number().optional(),
    west: z.coerce.number().optional(),
    up: z.coerce.number().optional(),
    down: z.coerce.number().optional(),
})

export function parseNeighbors(requestUrl: string) {
    return strictEntries(zodSearchParams(requestUrl, neighborsSchema)).map(
        ([type, id]) => ({ type, id }),
    )
}

export async function linkTile(
    user: AuthUser,
    neighbors: ReturnType<typeof parseNeighbors>,
    gridId: number,
    resourceId: number,
) {
    await db.transaction(async (tx) => {
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
                    name: `${resourceId} - ${neighbor.type}`,
                },
                {
                    user_id: user.id,
                    grid_id: gridId,
                    from_tile_id: neighbor.id,
                    to_tile_id: resourceId,
                    type: GATE_TYPE_OPPOSITES[neighbor.type],
                    name: `${neighbor.id} - ${
                        GATE_TYPE_OPPOSITES[neighbor.type]
                    }`,
                },
            ])
        }
    })
}
