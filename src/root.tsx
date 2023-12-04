import { Theme } from "@itsmapleleaf/radix-themes"
import { cssBundleHref } from "@remix-run/css-bundle"
import {
    Links,
    LiveReload,
    Meta,
    Outlet,
    Scripts,
    ScrollRestoration,
} from "@remix-run/react"
import { Analytics } from "@vercel/analytics/react"
import { type LinksFunction, type MetaFunction } from "@vercel/remix"

import stylesheet from "~/styles.css"
import "@itsmapleleaf/radix-themes/styles.css"

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

export default function App() {
    return (
        <html lang="en" suppressHydrationWarning>
            <head>
                <meta charSet="utf-8" />
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1"
                />
                <Meta />
                <Links />
            </head>
            <body>
                <Theme appearance="dark" accentColor="ruby">
                    <div
                        className={
                            "flex min-h-screen flex-col items-center bg-gradient-to-b from-zinc-700 to-zinc-900 font-sans text-zinc-100"
                        }
                    >
                        <Outlet />
                    </div>
                </Theme>
                <ScrollRestoration />
                <Scripts />
                <LiveReload />
                <Analytics />
            </body>
        </html>
    )
}
