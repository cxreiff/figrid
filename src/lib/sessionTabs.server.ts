import { createCookieSessionStorage } from "@vercel/remix"

const isProduction = process.env.NODE_ENV === "production"

export const {
    getSession: getSessionTabs,
    commitSession: commitSessionTabs,
    destroySession: destroySessionTabs,
} = createCookieSessionStorage({
    cookie: {
        name: "tabs",
        path: "/",
        httpOnly: true,
        sameSite: "lax",
        secrets: [process.env.SESSION_SECRET],
        ...(isProduction ? { domain: "figrid.io", secure: true } : {}),
    },
})
