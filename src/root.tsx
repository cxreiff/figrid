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
import { PreventFlashOnWrongTheme, ThemeProvider } from "remix-themes"
import { themeSessionResolver } from "~/lib/sessionTheme.server.ts"

import stylesheet from "~/styles.css"
import {
    ContextThemeTransition,
    useThemeTransitionInitialContext,
} from "~/lib/contextThemeTransition.ts"
import { useContext } from "react"
import { cn } from "~/lib/misc.ts"
import { LoadingIndicator } from "~/ui/loadingIndicator.tsx"
import { SVGs } from "~/ui/svgs.tsx"

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
        env: {
            R2_ASSETS_HOSTNAME: process.env.R2_ASSETS_HOSTNAME,
        },
    }
}

function App() {
    const { theme } = useLoaderData<typeof loader>()
    const { themeTransitioning, theme: themeClass } = useContext(
        ContextThemeTransition,
    )

    return (
        <html
            lang="en"
            className={cn(themeClass, {
                "theme-transition": themeTransitioning,
            })}
            suppressHydrationWarning
        >
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
                <LoadingIndicator />
                <Outlet />
                <SVGs />
                <ScrollRestoration />
                <Scripts />
                <LiveReload />
                <Analytics debug={false} />
                <SpeedInsights debug={false} />
            </body>
        </html>
    )
}

function AppWithThemeTransition() {
    return (
        <ContextThemeTransition.Provider
            value={useThemeTransitionInitialContext()}
        >
            <App />
        </ContextThemeTransition.Provider>
    )
}

export default function Root() {
    const { theme } = useLoaderData<typeof loader>()

    return (
        <ThemeProvider specifiedTheme={theme} themeAction="/actions/theme">
            <AppWithThemeTransition />
        </ThemeProvider>
    )
}
