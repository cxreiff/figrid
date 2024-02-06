import type { ActionFunctionArgs } from "@vercel/remix"
import { and, eq } from "drizzle-orm"
import { z } from "zod"
import { auth } from "~/auth/auth.server.ts"
import { db } from "~/database/database.server.ts"
import { likes } from "~/database/schema/likes.server.ts"

const paramsSchema = z.object({
    gridId: z.coerce.number(),
})

export async function action({ request, params }: ActionFunctionArgs) {
    const user = await auth.isAuthenticated(request, {
        failureRedirect: "/auth/login",
    })

    const { gridId } = paramsSchema.parse(params)

    await db
        .delete(likes)
        .where(and(eq(likes.user_id, user.id), eq(likes.grid_id, gridId)))

    return new Response(null, { status: 200 })
}
