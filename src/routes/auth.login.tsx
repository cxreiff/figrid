import { Button } from "@itsmapleleaf/radix-themes"
import { GitHubLogoIcon } from "@radix-ui/react-icons"
import { Form } from "@remix-run/react"
import { type LoaderFunctionArgs } from "@vercel/remix"
import { auth } from "~/auth/auth.server.ts"

export async function loader({ request }: LoaderFunctionArgs) {
    return auth.isAuthenticated(request, {
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
                <Button type="submit" variant="outline" color="ruby" className="cursor-pointer">
                    <GitHubLogoIcon /> Login with GitHub
                </Button>
            </Form>
        </>
    )
}
