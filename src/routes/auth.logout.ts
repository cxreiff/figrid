import { type ActionFunctionArgs } from "@vercel/remix"
import { authenticator } from "~/auth/authenticator.server.ts"

export async function action({ request }: ActionFunctionArgs) {
    return await authenticator.logout(request, {
        redirectTo: "/auth/login",
    })
}
