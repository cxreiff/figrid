import {
    EnvelopeClosedIcon,
    GitHubLogoIcon,
    LockClosedIcon,
} from "@radix-ui/react-icons"
import { Form, Link } from "@remix-run/react"
import { type LoaderFunctionArgs } from "@vercel/remix"
import { auth } from "~/auth/auth.server.ts"
import { ButtonWithIcon } from "~/ui/buttonWithIcon.tsx"
import { InputWithIcon } from "~/ui/primitives/input.tsx"
import { Button } from "~/ui/primitives/button.tsx"
import { Separator } from "~/ui/primitives/separator.tsx"
import { Layout } from "~/ui/layout/layout.tsx"

export async function loader({ request }: LoaderFunctionArgs) {
    return auth.isAuthenticated(request, {
        successRedirect: "/",
    })
}

export default function Route() {
    return (
        <Layout user={null}>
            <div className="flex min-h-screen flex-col items-center justify-center">
                <Form action="/auth/github" method="post" className="w-72">
                    <ButtonWithIcon
                        icon={GitHubLogoIcon}
                        type="submit"
                        variant="outline"
                        alignIcon="left"
                        className="w-full bg-card pr-6"
                    >
                        Login with GitHub
                    </ButtonWithIcon>
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
                <Separator className="mb-4 mt-12 w-64" />
                <p>
                    no account?{" "}
                    <Button variant="default" asChild>
                        <Link to="/auth/register">register</Link>
                    </Button>
                </p>
            </div>
        </Layout>
    )
}
