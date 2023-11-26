import { eq } from "drizzle-orm"
import { FormStrategy } from "remix-auth-form"
import { z } from "zod"
import { getSessionExpirationDate } from "~/auth/authenticator.server"
import { db } from "~/utilities/database.server"
import { users, sessions } from "~/utilities/schema.server"
import bcrypt from "~/../resources/bcrypt.min.cjs"

export const FORM_STRATEGY = "FORM_STRATEGY"

export const formStrategy = new FormStrategy(async ({ form }) => {
    const { email, password } = z
        .object({
            email: z.string().email(),
            password: z.string().min(8),
        })
        .parse(Object.fromEntries(form))

    const hashed = await bcrypt.hash(password, 10)
    const user = await login(email, hashed || "mock")

    return user
})

async function login(email: string, hash: string) {
    const user = await db.query.users.findFirst({
        with: { password: true },
        where: eq(users.email, email),
    })

    if (!user || !user.password) {
        throw new Error("no user found.")
    }

    if (!bcrypt.compare(hash, user.password.hash)) {
        throw new Error("invalid password.")
    }

    const { insertId: sessionId } = await db.insert(sessions).values({
        user_id: user.id,
        expiration_date: getSessionExpirationDate(),
    })

    if (!sessionId) {
        throw new Error("failed to create session.")
    }

    return user
}
