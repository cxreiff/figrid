import { cssBundleHref } from "@remix-run/css-bundle"
import {
    Link,
    Links,
    LiveReload,
    Meta,
    Outlet,
    Scripts,
    ScrollRestoration,
    useLoaderData,
} from "@remix-run/react"
import { Analytics } from "@vercel/analytics/react"
import {
    type LoaderFunctionArgs,
    type LinksFunction,
    type MetaFunction,
} from "@vercel/remix"
import { authenticator } from "~/auth/authenticator.server.ts"
import { ProfileButton } from "~/components/profileButton.tsx"

import stylesheet from "~/styles.css"

export const config = { runtime: "edge" }

export const meta: MetaFunction = () => {
    return [
        { title: "figrid" },
        { name: "description", content: "text adventure service" },
    ]
}

export const links: LinksFunction = () => [
    ...(cssBundleHref ? [{ rel: "stylesheet", href: cssBundleHref }] : []),
    { rel: "stylesheet", href: stylesheet },
]

export async function loader({ request }: LoaderFunctionArgs) {
    return await authenticator.isAuthenticated(request)
}

export default function App() {
    const user = useLoaderData<typeof loader>()

    return (
        <html lang="en">
            <head>
                <meta charSet="utf-8" />
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1"
                />
                <Meta />
                <Links />
            </head>
            <body
                className={
                    "min-h-screen bg-gradient-to-b from-zinc-700 to-zinc-900 font-sans text-white"
                }
            >
                <div className="flex min-h-screen flex-col">
                    <div className="m-2 flex h-16 items-center gap-4 border border-zinc-500 px-2 py-2">
                        <Link to="/" className="grow px-4">
                            <h1>figrid</h1>
                        </Link>
                        <Link to="/room/1">/room/1</Link>
                        <ProfileButton user={user} />
                    </div>
                    <main className="m-2 flex grow flex-col items-center justify-center border border-zinc-500">
                        <Outlet />
                    </main>
                </div>
                <ScrollRestoration />
                <Scripts />
                <LiveReload />
                <Analytics />
            </body>
        </html>
    )
}
