import type { ActionFunctionArgs } from "@vercel/remix"
import { z } from "zod"
import { layoutCookieSchema } from "~/utilities/contextLayout.ts"
import {
    commitSessionLayout,
    getSessionLayout,
} from "~/utilities/sessionLayout.server.ts"

export async function action({ request }: ActionFunctionArgs) {
    const sessionLayout = await getSessionLayout(request.headers.get("Cookie"))

    const formData = Object.fromEntries(await request.formData())
    const { data } = z.object({ data: z.string() }).parse(formData)
    const { read, area, status, write } = layoutCookieSchema.parse(
        JSON.parse(data),
    )

    read && sessionLayout.set("read", read)
    area && sessionLayout.set("area", area)
    status && sessionLayout.set("status", status)
    write && sessionLayout.set("write", write)

    return new Response(undefined, {
        headers: {
            "Set-Cookie": await commitSessionLayout(sessionLayout),
        },
    })
}
