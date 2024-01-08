import {
    EnvelopeClosedIcon,
    GitHubLogoIcon,
    LockClosedIcon,
} from "@radix-ui/react-icons"
import { Form } from "@remix-run/react"
import { type LoaderFunctionArgs } from "@vercel/remix"
import { auth } from "~/auth/auth.server.ts"
import { Button } from "~/components/ui/button.tsx"
import { InputWithIcon } from "~/components/ui/input.tsx"
import { Separator } from "~/components/ui/separator.tsx"

export async function loader({ request }: LoaderFunctionArgs) {
    return auth.isAuthenticated(request, {
        successRedirect: "/protected",
    })
}

export default function Login() {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center">
            <Form action="/auth/github" method="post" className="w-72">
                <Button
                    type="submit"
                    variant="outline"
                    className="relative w-full bg-card"
                >
                    <GitHubLogoIcon className="absolute left-3" />
                    <span className="w-full px-10">Login with GitHub</span>
                </Button>
            </Form>
            <Separator className="my-4 w-64" />
            <Form
                className="flex w-72 flex-col gap-2"
                action="/auth/form"
                method="post"
            >
                <InputWithIcon
                    icon={EnvelopeClosedIcon}
                    className="bg-card"
                    name="email"
                    type="email"
                    placeholder="email address"
                />
                <InputWithIcon
                    icon={LockClosedIcon}
                    className="bg-card"
                    name="password"
                    type="password"
                    placeholder="password"
                />
                <Button variant="outline" type="submit" className="bg-card">
                    log in
                </Button>
            </Form>
        </div>
    )
}
