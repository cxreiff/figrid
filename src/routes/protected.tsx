import { Button } from "~/components/ui/button.tsx"
import { Form, useLoaderData } from "@remix-run/react"
import {
    json,
    type ActionFunctionArgs,
    type LoaderFunctionArgs,
} from "@vercel/remix"
import { auth } from "~/auth/auth.server.ts"

export async function loader({ request }: LoaderFunctionArgs) {
    const user = await auth.isAuthenticated(request, {
        failureRedirect: "/auth/login",
    })
    return json({ user })
}

export async function action({ request }: ActionFunctionArgs) {
    return await auth.logout(request, {
        redirectTo: "/auth/login",
    })
}

export default function Login() {
    const { user } = useLoaderData<typeof loader>()

    return (
        <Form
            className="flex min-h-screen flex-col items-center justify-center gap-2 p-4"
            method="post"
        >
            <div className="mb-4">logged in</div>
            <div className="w-fit">
                <div>{user.email}</div>
                <div>{user.alias}</div>
                <div>{user.name}</div>
                <div>{user.type}</div>
            </div>
            <Button type="submit" variant="outline" className="mt-8">
                log out
            </Button>
        </Form>
    )
}
