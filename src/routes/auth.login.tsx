import { Button, Separator, TextField } from "@itsmapleleaf/radix-themes"
import {
    EnvelopeClosedIcon,
    GitHubLogoIcon,
    LockClosedIcon,
} from "@radix-ui/react-icons"
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
        <div className="flex min-h-screen flex-col items-center justify-center">
            <Form action="/auth/github" method="post" className="p-4">
                <Button type="submit" variant="outline">
                    <GitHubLogoIcon /> Login with GitHub
                </Button>
            </Form>
            <Separator size={"3"} className="my-4" />
            <Form
                className="flex w-fit flex-col gap-2 p-4"
                action="/auth/form"
                method="post"
            >
                <TextField.Root className="mb-2">
                    <TextField.Slot>
                        <EnvelopeClosedIcon />
                    </TextField.Slot>
                    <TextField.Input
                        name="email"
                        type="email"
                        placeholder="email address"
                    />
                </TextField.Root>
                <TextField.Root className="mb-2">
                    <TextField.Slot>
                        <LockClosedIcon />
                    </TextField.Slot>
                    <TextField.Input
                        name="password"
                        type="password"
                        placeholder="password"
                    />
                </TextField.Root>
                <Button variant="outline" type="submit">
                    log in
                </Button>
            </Form>
        </div>
    )
}
