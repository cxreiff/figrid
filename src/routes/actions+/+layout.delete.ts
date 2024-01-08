import type { ActionFunctionArgs } from "@vercel/remix"
import {
    destroySessionLayout,
    getSessionLayout,
} from "~/lib/sessionLayout.server.ts"

export async function action({ request }: ActionFunctionArgs) {
    const sessionLayout = await getSessionLayout(request.headers.get("Cookie"))

    return new Response(undefined, {
        headers: {
            "Set-Cookie": await destroySessionLayout(sessionLayout),
        },
    })
}
