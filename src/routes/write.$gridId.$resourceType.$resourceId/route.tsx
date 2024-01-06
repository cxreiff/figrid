import { useParams } from "@remix-run/react"
import { z } from "zod"
import { Editor } from "~/routes/write.$gridId.$resourceType.$resourceId/editor.tsx"
import { withZod } from "@remix-validated-form/with-zod"
import type { ActionFunctionArgs } from "@vercel/remix"
import { and, eq } from "drizzle-orm"
import { validationError } from "remix-validated-form"
import { db } from "~/database/database.server.ts"
import { tiles } from "~/database/schema/grids.server.ts"
import { paramsSchema as parentParamsSchema } from "~/routes/write.$gridId/route.tsx"

export const paramsSchema = z.object({
    resourceType: z.enum(["tiles", "characters", "items", "events"]),
    resourceId: z.coerce.number(),
})

export const formSchema = withZod(
    z.object({
        name: z.string().min(1, { message: "name is required" }),
        summary: z.string(),
        description: z.string(),
    }),
)

export async function action({ request, params }: ActionFunctionArgs) {
    const { gridId, resourceId } = parentParamsSchema
        .merge(paramsSchema)
        .parse(params)
    const formData = await formSchema.validate(await request.formData())
    if (formData.error) return validationError(formData.error)

    return await db
        .update(tiles)
        .set({
            id: resourceId,
            ...formData.data,
        })
        .where(and(eq(tiles.id, resourceId), eq(tiles.grid_id, gridId)))
}

export default function Route() {
    const { resourceType, resourceId } = paramsSchema.parse(useParams())

    if (!resourceType) {
        return null
    }

    return <Editor id={Number(resourceId)} type={resourceType} />
}
