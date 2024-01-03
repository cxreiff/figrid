import { createCookieSessionStorage } from "@vercel/remix"
import { createThemeSessionResolver } from "remix-themes"

const isProduction = process.env.NODE_ENV === "production"

const sessionTheme = createCookieSessionStorage({
    cookie: {
        name: "theme",
        path: "/",
        httpOnly: true,
        sameSite: "lax",
        secrets: [process.env.SESSION_SECRET],
        ...(isProduction ? { domain: "figrid.io", secure: true } : {}),
    },
})

export const themeSessionResolver = createThemeSessionResolver(sessionTheme)
