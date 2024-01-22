import {
    json,
    unstable_composeUploadHandlers as composeUploadHandlers,
    unstable_createMemoryUploadHandler as createMemoryUploadHandler,
    unstable_parseMultipartFormData as parseMultipartFormData,
    type ActionFunctionArgs,
} from "@vercel/remix"
import { customAlphabet } from "nanoid"
import { z } from "zod"
import { ASSET_TYPES, RESOURCE_TYPES_WITH_ASSETS } from "~/lib/assets.ts"
import { createR2UploadHandler } from "~/lib/r2.server.ts"

const filenamer = customAlphabet("0123456789abcdefghijklmnopqrstuvwxyz", 16)

export const paramsSchema = z.object({
    gridId: z.coerce.number(),
    resourceType: z.enum(RESOURCE_TYPES_WITH_ASSETS),
    assetType: z.enum(ASSET_TYPES),
})

export const config = { runtime: "node" }

export async function action({ request, params }: ActionFunctionArgs) {
    const { gridId, resourceType, assetType } = paramsSchema.parse(params)

    const filename = filenamer()
    const key = `grids/${gridId}/${resourceType}/${assetType}/${filename}`

    const formData = await parseMultipartFormData(
        request,
        composeUploadHandlers(
            createR2UploadHandler(key),
            createMemoryUploadHandler(),
        ),
    )

    if (!formData.get("asset")) {
        throw new Response(null, {
            status: 500,
            statusText: "upload failed",
        })
    }

    return json({ filename })
}
