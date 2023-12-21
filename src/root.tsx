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
import { SpeedInsights } from "@vercel/speed-insights/remix"

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

export default function App() {
    return (
        <html lang="en" className="dark-theme dark" suppressHydrationWarning>
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
                <Theme id="theme" accentColor="ruby">
                    <Outlet />
                </Theme>
                <ScrollRestoration />
                <Scripts />
                <LiveReload />
                <Analytics />
                <SpeedInsights />
            </body>
        </html>
    )
}
