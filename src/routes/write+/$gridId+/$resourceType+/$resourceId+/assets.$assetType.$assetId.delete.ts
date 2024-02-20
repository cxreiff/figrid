import { type ActionFunctionArgs } from "@vercel/remix"
import { and, eq } from "drizzle-orm"
import { z } from "zod"
import { auth } from "~/auth/auth.server.ts"
import { db } from "~/database/database.server.ts"
import { ASSET_RESOURCE_TYPES, ASSET_TYPES } from "~/database/enums.ts"
import { assets } from "~/database/schema/assets.server.ts"
import { assetPrefix } from "~/lib/assets.ts"
import { deleteResource } from "~/lib/r2.server.ts"
import { RESOURCE_TABLES } from "~/routes/write+/$gridId+/$resourceType+/$resourceId+/assets.$assetType.$label.ts"
import { paramsSchema as parentParamsSchema } from "~/routes/write+/$gridId+/_route.tsx"

export const paramsSchema = z.object({
    resourceType: z.enum(ASSET_RESOURCE_TYPES),
    assetId: z.coerce.number(),
    assetType: z.enum(ASSET_TYPES),
})

export const config = { runtime: "node" }

export async function action({ request, params }: ActionFunctionArgs) {
    const user = await auth.isAuthenticated(request, {
        failureRedirect: "/auth/login",
    })

    const { gridId, resourceType, assetType, assetId } = paramsSchema
        .merge(parentParamsSchema)
        .parse(params)

    const prefix = assetPrefix(gridId, resourceType, assetType)

    const condition = and(
        eq(assets.user_id, user.id),
        eq(assets.grid_id, gridId),
        eq(assets.id, assetId),
    )

    await db.transaction(async (tx) => {
        const asset = await tx.query.assets.findFirst({ where: condition })

        if (!asset) {
            return new Response(null, { status: 400 })
        }

        await deleteResource(`${prefix}/${asset.filename}`)

        await tx
            .update(RESOURCE_TABLES[resourceType])
            .set({
                image_asset_id: null,
            })
            .where(eq(RESOURCE_TABLES[resourceType].image_asset_id, assetId))

        await tx.delete(assets).where(condition)
    })

    return new Response(null, { status: 200 })
}
