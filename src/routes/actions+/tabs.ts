import type { ActionFunctionArgs } from "@vercel/remix"
import { z } from "zod"
import { tabsCookieSchema } from "~/lib/contextTabs.ts"
import { commitSessionTabs, getSessionTabs } from "~/lib/sessionTabs.server.ts"

export async function action({ request }: ActionFunctionArgs) {
    const sessionLayout = await getSessionTabs(request.headers.get("Cookie"))

    const formData = Object.fromEntries(await request.formData())
    const { data } = z.object({ data: z.string() }).parse(formData)
    const { readTab, infoTab, writeTab, resourceTab, centerTab, detailsTab } =
        tabsCookieSchema.parse(JSON.parse(data))

    readTab && sessionLayout.set("readTab", readTab)
    infoTab && sessionLayout.set("infoTab", infoTab)
    writeTab && sessionLayout.set("writeTab", writeTab)
    resourceTab && sessionLayout.set("resourceTab", resourceTab)
    centerTab && sessionLayout.set("centerTab", centerTab)
    detailsTab && sessionLayout.set("detailsTab", detailsTab)

    return new Response(undefined, {
        headers: {
            "Set-Cookie": await commitSessionTabs(sessionLayout),
        },
    })
}
