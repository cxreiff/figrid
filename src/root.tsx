import { cssBundleHref } from "@remix-run/css-bundle"
import {
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
    type LinksFunction,
    type LoaderFunctionArgs,
    type MetaFunction,
} from "@vercel/remix"
import { SpeedInsights } from "@vercel/speed-insights/remix"
import clsx from "clsx"
import { PreventFlashOnWrongTheme, ThemeProvider, useTheme } from "remix-themes"
import { themeSessionResolver } from "~/utilities/themeSession.server.ts"

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
    const { getTheme } = await themeSessionResolver(request)
    return {
        theme: getTheme(),
    }
}

export function App() {
    const { theme } = useLoaderData<typeof loader>()
    const [themeClass] = useTheme()

    return (
        <html lang="en" className={clsx(themeClass)} suppressHydrationWarning>
            <head>
                <meta charSet="utf-8" />
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1"
                />
                <Meta />
                <PreventFlashOnWrongTheme ssrTheme={Boolean(theme)} />
                <Links />
            </head>
            <body>
                <Outlet />
                <ScrollRestoration />
                <Scripts />
                <LiveReload />
                <Analytics />
                <SpeedInsights />
            </body>
        </html>
    )
}

export default function Root() {
    const { theme } = useLoaderData<typeof loader>()

    return (
        <ThemeProvider specifiedTheme={theme} themeAction="/action/theme">
            <App />
        </ThemeProvider>
    )
}
