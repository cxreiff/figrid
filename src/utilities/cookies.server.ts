import { createCookie } from "@vercel/remix"

export const userPrefs = createCookie("user-prefs", {
    maxAge: 60 * 60 * 24 * 365,
})
