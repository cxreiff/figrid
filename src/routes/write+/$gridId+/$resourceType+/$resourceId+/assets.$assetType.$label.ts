import {
    json,
    unstable_composeUploadHandlers as composeUploadHandlers,
    unstable_createMemoryUploadHandler as createMemoryUploadHandler,
    unstable_parseMultipartFormData as parseMultipartFormData,
    type ActionFunctionArgs,
} from "@vercel/remix"
import { and, eq } from "drizzle-orm"
import { customAlphabet } from "nanoid"
import { z } from "zod"
import { auth } from "~/auth/auth.server.ts"
import { db } from "~/database/database.server.ts"
import { ASSET_RESOURCE_TYPES, ASSET_TYPES } from "~/database/enums.ts"
import { assets } from "~/database/schema/assets.server.ts"
import { characters } from "~/database/schema/characters.server.ts"
import { events } from "~/database/schema/events.server.ts"
import { grids } from "~/database/schema/grids.server.ts"
import { items } from "~/database/schema/items.server.ts"
import { tiles } from "~/database/schema/tiles.server.ts"
import { assetPrefix } from "~/lib/assets.ts"
import { createR2UploadHandler } from "~/lib/r2.server.ts"
import { paramsSchema as parentParamsSchema } from "~/routes/write+/$gridId+/_route.tsx"

const randomKey = customAlphabet("0123456789abcdefghijklmnopqrstuvwxyz", 16)

export const paramsSchema = z.object({
    resourceType: z.enum(ASSET_RESOURCE_TYPES),
    resourceId: z.coerce.number(),
    assetType: z.enum(ASSET_TYPES),
    label: z.string(),
})

export const RESOURCE_TABLES = {
    grid: grids,
    characters: characters,
    events: events,
    items: items,
    tiles: tiles,
}

export const config = { runtime: "node" }

export async function action({ request, params }: ActionFunctionArgs) {
    const user = await auth.isAuthenticated(request, {
        failureRedirect: "/auth/login",
    })

    const { gridId, resourceType, resourceId, assetType, label } = paramsSchema
        .merge(parentParamsSchema)
        .parse(params)

    const prefix = assetPrefix(gridId, resourceType, assetType)
    const key = randomKey()

    const formData = await parseMultipartFormData(
        request,
        composeUploadHandlers(
            createR2UploadHandler(prefix, key),
            createMemoryUploadHandler(),
        ),
    )

    const filename = formData.get("asset")?.toString()

    if (!filename) {
        throw new Response(null, {
            status: 500,
            statusText: "upload failed",
        })
    }

    await db.transaction(async (tx) => {
        const [{ insertId }] = await tx
            .insert(assets)
            .values({
                user_id: user.id,
                grid_id: gridId,
                resource_type: resourceType,
                asset_type: assetType,
                filename,
                label,
            })
            .returning({ insertId: assets.id })

        if (resourceType === "grid") {
            const resource_table = RESOURCE_TABLES[resourceType]
            await tx
                .update(resource_table)
                .set({
                    image_asset_id: Number(insertId),
                })
                .where(
                    and(
                        eq(resource_table.user_id, user.id),
                        eq(resource_table.id, gridId),
                        eq(resource_table.id, resourceId),
                    ),
                )
        } else {
            const resource_table = RESOURCE_TABLES[resourceType]
            await tx
                .update(resource_table)
                .set({
                    image_asset_id: Number(insertId),
                })
                .where(
                    and(
                        eq(resource_table.user_id, user.id),
                        eq(resource_table.grid_id, gridId),
                        eq(resource_table.id, resourceId),
                    ),
                )
        }
    })

    return json({ filename })
}
