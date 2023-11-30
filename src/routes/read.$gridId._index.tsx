import { redirect, type LoaderFunctionArgs } from "@vercel/remix"
import { eq } from "drizzle-orm"
import { z } from "zod"
import { db } from "~/database/database.server.ts"
import { grids } from "~/database/schema/grids.server.ts"

export async function loader({ params }: LoaderFunctionArgs) {
    const { gridId } = z.object({ gridId: z.coerce.number() }).parse(params)

    const [grid] = await db
        .select()
        .from(grids)
        .where(eq(grids.id, gridId))
        .limit(1)

    if (!grid) {
        throw new Response("Not Found", { status: 404 })
    }

    return redirect(`/read/${gridId}/${grid.first_id}`)
}
