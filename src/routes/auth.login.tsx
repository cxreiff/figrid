import {
    EnvelopeClosedIcon,
    GitHubLogoIcon,
    LockClosedIcon,
} from "@radix-ui/react-icons"
import { Form } from "@remix-run/react"
import { type LoaderFunctionArgs } from "@vercel/remix"
import { auth } from "~/auth/auth.server.ts"
import { Button } from "~/components/ui/button.tsx"
import { Input } from "~/components/ui/input.tsx"
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
                    className="relative w-full"
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
                <div className="relative mb-2 w-full">
                    <EnvelopeClosedIcon className="absolute left-3 h-full" />
                    <Input
                        className="pl-10"
                        name="email"
                        type="email"
                        placeholder="email address"
                    />
                </div>
                <div className="relative mb-2 w-full">
                    <LockClosedIcon className="absolute left-3 h-full" />
                    <Input
                        className="pl-10"
                        name="password"
                        type="password"
                        placeholder="password"
                    />
                </div>
                <Button variant="outline" type="submit">
                    log in
                </Button>
            </Form>
        </div>
    )
}
