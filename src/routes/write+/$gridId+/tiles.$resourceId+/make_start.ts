import { type ActionFunctionArgs } from "@vercel/remix"
import { and, eq } from "drizzle-orm"
import { z } from "zod"
import { auth } from "~/auth/auth.server.ts"
import { db } from "~/database/database.server.ts"
import { grids } from "~/database/schema/grids.server.ts"
import { redirectBack } from "~/lib/misc.ts"
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

    await db
        .update(grids)
        .set({ first_tile_id: resourceId })
        .where(and(eq(grids.user_id, user.id), eq(grids.id, gridId)))

    return redirectBack(request, `/write/${gridId}`)
}
