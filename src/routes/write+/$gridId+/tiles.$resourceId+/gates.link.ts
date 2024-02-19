import { redirect, type ActionFunctionArgs } from "@vercel/remix"
import { z } from "zod"
import { auth } from "~/auth/auth.server.ts"
import { paramsSchema as parentParamsSchema } from "~/routes/write+/$gridId+/_route.tsx"
import {
    linkTile,
    parseNeighbors,
} from "~/routes/write+/lib/linkTile.server.ts"

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

    const neighbors = parseNeighbors(request.url)

    await linkTile(user, neighbors, gridId, resourceId)

    return redirect(`/write/${gridId}/tiles/${resourceId}`)
}
