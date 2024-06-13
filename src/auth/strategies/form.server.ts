import { eq } from "drizzle-orm"
import { FormStrategy } from "remix-auth-form"
import { z } from "zod"
import {
    comparePassWithHash,
    getSessionExpirationDate,
} from "~/auth/auth.server.ts"
import { db } from "~/database/database.server.ts"
import { users, sessions } from "~/database/schema/auth.server.ts"

export const FORM_STRATEGY = "FORM_STRATEGY"

export const formStrategy = new FormStrategy(async ({ form }) => {
    const { email, password } = z
        .object({
            email: z.string().email(),
            password: z.string().min(8),
        })
        .parse(Object.fromEntries(form))

    const user = await db.query.users.findFirst({
        with: { password: true, profile: true },
        where: eq(users.email, email),
    })

    if (!user || !user.password) {
        throw new Error("no user found.")
    }
    if (!(await comparePassWithHash(password, user.password.hash))) {
        throw new Error("invalid password.")
    }

    const [{ sessionId }] = await db
        .insert(sessions)
        .values({
            user_id: user.id,
            expiration_date: getSessionExpirationDate(),
        })
        .returning({ sessionId: sessions.id })

    if (!sessionId) {
        throw new Error("failed to create session.")
    }

    return {
        id: user.id,
        alias: user.alias,
        email: user.email,
        name: user.name,
        type: user.type,
        profile: user.profile,
    }
})
