import { FormStrategy } from "remix-auth-form"
import bcrypt from "bcryptjs"
import { z } from "zod"
import { db } from "~/utilities/database.server"
import { sessions, users } from "~/utilities/schema.server"
import { eq } from "drizzle-orm"
import { getSessionExpirationDate } from "~/auth/authenticator.server"

export const FORM_PROVIDER = "form_provider"

export const formStrategy = new FormStrategy(async ({ form }) => {
  const { email, password } = z
    .object({
      email: z.string().email(),
      password: z.string().min(8),
    })
    .parse(Object.fromEntries(form))

  const hash = await hashPassword(password)
  const user = await login(email, hash)

  return user
})

async function hashPassword(password: string) {
  return await bcrypt.hash(password, 10)
}

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

  const session = await db.insert(sessions).values({
    user_id: user.id,
    expiration_date: getSessionExpirationDate(),
  })

  if (!session.insertId) {
    throw new Error("failed to create session.")
  }

  return user
}
