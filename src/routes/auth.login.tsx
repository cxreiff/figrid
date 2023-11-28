import { GitHubLogoIcon } from "@radix-ui/react-icons"
import { Form } from "@remix-run/react"
import { type LoaderFunctionArgs } from "@vercel/remix"
import { authenticator } from "~/auth/authenticator.server.ts"

export async function loader({ request }: LoaderFunctionArgs) {
    return authenticator.isAuthenticated(request, {
        successRedirect: "/protected",
    })
}

export default function Login() {
    return (
        <>
            <Form
                className="flex flex-col gap-2 p-4"
                action="/auth/form"
                method="post"
            >
                <input
                    className="bg-black p-2"
                    name="email"
                    type="email"
                    placeholder="email address"
                />
                <input
                    className="bg-black p-2"
                    name="password"
                    type="password"
                    placeholder="password"
                />
                <button type="submit">log in</button>
            </Form>
            OR
            <Form action="/auth/github" method="post" className="p-4">
                <button type="submit">
                    <span className="whitespace-nowrap">
                        <GitHubLogoIcon /> Login with GitHub
                    </span>
                </button>
            </Form>
        </>
    )
}
