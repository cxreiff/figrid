import type { LoaderFunctionArgs } from "@vercel/remix"
import { z } from "zod"
import { ROUTE_STRATEGY_MAP, auth } from "~/auth/auth.server.ts"

export async function loader({ request, params }: LoaderFunctionArgs) {
    const { strategy } = z.object({ strategy: z.string() }).parse(params)
    return auth.authenticate(ROUTE_STRATEGY_MAP[strategy], request, {
        successRedirect: "/protected",
        failureRedirect: "/auth/login",
    })
}
