import { Authenticator } from "remix-auth"
import { createCookieSessionStorage } from "@vercel/remix"
import {
    type ProfilesSelectModel,
    type UsersSelectModel,
} from "~/database/schema/auth.server.ts"
import { FORM_STRATEGY, formStrategy } from "~/auth/strategies/form.server.ts"
import {
    GITHUB_STRATEGY,
    gitHubStrategy,
} from "~/auth/strategies/github.server.ts"
import bcrypt from "~/../resources/bcrypt.min.cjs"
import { customAlphabet } from "nanoid"

bcrypt.setRandomFallback((bytes: number) =>
    customAlphabet("0123456789", bytes)().split("").map(Number),
)

export type AuthUser = Pick<
    UsersSelectModel,
    "alias" | "email" | "name" | "type"
> & {
    profile: Pick<ProfilesSelectModel, "image_url">
}

export const SESSION_EXPIRATION_TIME = 1000 * 60 * 60 * 24 * 30

export const sessionStorage = createCookieSessionStorage({
    cookie: {
        name: "en_session",
        sameSite: "lax",
        path: "/",
        httpOnly: true,
        secrets: [process.env.SESSION_SECRET],
        secure: process.env.NODE_ENV === "production",
    },
})

export const ROUTE_STRATEGY_MAP: Record<string, string> = {
    github: GITHUB_STRATEGY,
    form: FORM_STRATEGY,
}

export const auth = new Authenticator<AuthUser>(sessionStorage)

auth.use(formStrategy, FORM_STRATEGY)
auth.use(gitHubStrategy, GITHUB_STRATEGY)

export function getSessionExpirationDate() {
    return new Date(Date.now() + SESSION_EXPIRATION_TIME)
}

export async function hashPassword(password: string) {
    return await bcrypt.hash(password, bcrypt.genSaltSync(12))
}

export async function comparePassWithHash(password: string, hash: string) {
    return await bcrypt.compare(password, hash)
}
