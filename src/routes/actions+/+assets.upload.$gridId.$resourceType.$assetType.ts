import {
    json,
    unstable_composeUploadHandlers as composeUploadHandlers,
    unstable_createMemoryUploadHandler as createMemoryUploadHandler,
    unstable_parseMultipartFormData as parseMultipartFormData,
    type ActionFunctionArgs,
} from "@vercel/remix"
import { z } from "zod"
import { ASSET_TYPES, RESOURCE_TYPES_WITH_ASSETS } from "~/lib/assets.ts"
import { createR2UploadHandler } from "~/lib/r2.server.ts"

export const paramsSchema = z.object({
    gridId: z.coerce.number(),
    resourceType: z.enum(RESOURCE_TYPES_WITH_ASSETS),
    assetType: z.enum(ASSET_TYPES),
})

export async function action({ request, params }: ActionFunctionArgs) {
    const { gridId, resourceType, assetType } = paramsSchema.parse(params)

    const formData = await parseMultipartFormData(
        request,
        composeUploadHandlers(
            createR2UploadHandler({ gridId, resourceType, assetType }),
            createMemoryUploadHandler(),
        ),
    )

    const asset = formData.get("asset")?.toString()
    console.debug(asset)
    return json({ asset })
}
