import { Form, useLoaderData } from "@remix-run/react"
import {
    json,
    type ActionFunctionArgs,
    type LoaderFunctionArgs,
} from "@vercel/remix"
import { authenticator } from "~/auth/authenticator.server.ts"

export async function loader({ request }: LoaderFunctionArgs) {
    const user = await authenticator.isAuthenticated(request, {
        failureRedirect: "/auth/login",
    })
    return json({ user })
}

export async function action({ request }: ActionFunctionArgs) {
    return await authenticator.logout(request, {
        redirectTo: "/auth/login",
    })
}

export default function Login() {
    const { user } = useLoaderData<typeof loader>()

    return (
        <Form className="flex flex-col gap-2 p-4" method="post">
            <div>logged in</div>
            <div>{user.email}</div>
            <div>{user.alias}</div>
            <div>{user.name}</div>
            <div>{user.type}</div>
            <div>{user.profile.image_url}</div>
            <button type="submit">log out</button>
        </Form>
    )
}