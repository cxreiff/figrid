import { createCookieSessionStorage } from "@vercel/remix"

const isProduction = process.env.NODE_ENV === "production"

export const {
    getSession: getSessionLayout,
    commitSession: commitSessionLayout,
    destroySession: destroySessionLayout,
} = createCookieSessionStorage({
    cookie: {
        name: "layout",
        path: "/",
        httpOnly: true,
        sameSite: "lax",
        secrets: [process.env.SESSION_SECRET],
        ...(isProduction ? { domain: "figrid.io", secure: true } : {}),
    },
})
