import type { ActionFunctionArgs } from "@vercel/remix"
import { z } from "zod"
import { layoutCookieSchema } from "~/lib/contextLayout.ts"
import {
    commitSessionLayout,
    getSessionLayout,
} from "~/lib/sessionLayout.server.ts"

export async function action({ request }: ActionFunctionArgs) {
    const sessionLayout = await getSessionLayout(request.headers.get("Cookie"))

    const formData = Object.fromEntries(await request.formData())
    const { data } = z.object({ data: z.string() }).parse(formData)
    const { read, combo, visuals, area, status, write, details, config } =
        layoutCookieSchema.parse(JSON.parse(data))

    read && sessionLayout.set("read", read)
    combo && sessionLayout.set("combo", combo)
    visuals && sessionLayout.set("visuals", visuals)
    area && sessionLayout.set("area", area)
    status && sessionLayout.set("status", status)
    write && sessionLayout.set("write", write)
    details && sessionLayout.set("details", details)
    config && sessionLayout.set("config", config)

    return new Response(undefined, {
        headers: {
            "Set-Cookie": await commitSessionLayout(sessionLayout),
        },
    })
}
