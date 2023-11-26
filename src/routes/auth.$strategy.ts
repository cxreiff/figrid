import { type ActionFunctionArgs } from "@vercel/remix"
import { z } from "zod"
import {
    ROUTE_STRATEGY_MAP,
    authenticator,
} from "~/auth/authenticator.server.ts"

export async function action({ request, params }: ActionFunctionArgs) {
    const { strategy } = z.object({ strategy: z.string() }).parse(params)
    return authenticator.authenticate(ROUTE_STRATEGY_MAP[strategy], request)
}
