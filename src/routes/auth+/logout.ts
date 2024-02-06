import { type LoaderFunctionArgs } from "@vercel/remix"
import { auth } from "~/auth/auth.server.ts"

export async function loader({ request }: LoaderFunctionArgs) {
    return await auth.logout(request, {
        redirectTo: "/auth/login",
    })
}
