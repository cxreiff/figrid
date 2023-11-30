import { type LoaderFunctionArgs } from "@vercel/remix"
import { authenticator } from "~/auth/authenticator.server.ts"

export async function loader({ request }: LoaderFunctionArgs) {
    return await authenticator.logout(request, {
        redirectTo: "/auth/login",
    })
}
