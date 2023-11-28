import { Authenticator } from "remix-auth"
import { createCookieSessionStorage } from "@vercel/remix"
import {
    type ProfilesSelectModel,
    type UsersSelectModel,
} from "~/utilities/schema.server"
import { FORM_STRATEGY, formStrategy } from "~/auth/strategies/form.server"
import {
    GITHUB_STRATEGY,
    gitHubStrategy,
} from "~/auth/strategies/github.server"
import {
    setRandomFallback,
    genSaltSync,
    hash,
    compare,
} from "~/../resources/bcrypt.min.cjs"
import { nanoid } from "nanoid"

setRandomFallback((bytes: number) => nanoid(bytes))

type AuthUser = Pick<UsersSelectModel, "alias" | "email" | "name" | "type"> & {
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

export const authenticator = new Authenticator<AuthUser>(sessionStorage)

authenticator.use(formStrategy, FORM_STRATEGY)
authenticator.use(gitHubStrategy, GITHUB_STRATEGY)

export function getSessionExpirationDate() {
    return new Date(Date.now() + SESSION_EXPIRATION_TIME)
}

export async function hashPassword(password: string) {
    return await hash(password, genSaltSync(12))
}

export async function comparePassWithHash(password: string, hash: string) {
    return await compare(password, hash)
}
