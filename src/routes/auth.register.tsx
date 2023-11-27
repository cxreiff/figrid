import { Form } from "@remix-run/react"
import { type ActionFunctionArgs, type LoaderFunctionArgs } from "@vercel/remix"
import { eq, or } from "drizzle-orm"
import { z } from "zod"
import {
    authenticator,
    getSessionExpirationDate,
    hashPassword,
} from "~/auth/authenticator.server.ts"
import { FORM_STRATEGY } from "~/auth/strategies/form.server"
import { db } from "~/utilities/database.server"
import { passwords, profiles, sessions, users } from "~/utilities/schema.server"

export async function loader({ request }: LoaderFunctionArgs) {
    return authenticator.isAuthenticated(request, {
        successRedirect: "/protected",
    })
}

export async function action({ request }: ActionFunctionArgs) {
    const data = Object.fromEntries(await request.clone().formData())

    const { email, alias, password } = z
        .object({
            email: z.string().email(),
            alias: z.string().min(3),
            password: z.string().min(8),
            confirm: z.string(),
        })
        .refine(({ password, confirm }) => password === confirm, {
            path: ["confirm"],
            message: "entered passwords do not match",
        })
        .parse(data)

    const existing = await db
        .select()
        .from(users)
        .where(or(eq(users.email, email), eq(users.alias, alias)))

    if (existing.length > 0) {
        if (existing[0].email === email) {
            throw new Error("email already taken")
        }

        throw new Error("alias already taken")
    }

    const hash = await hashPassword(password)

    const user_id = await db.transaction(async (tx) => {
        const result = await tx.insert(users).values({
            email,
            alias,
        })

        const { insertId: user_id } = z
            .object({ insertId: z.coerce.number() })
            .parse(result)

        await tx.insert(profiles).values({
            user_id,
        })
        await tx.insert(sessions).values({
            user_id,
            expiration_date: getSessionExpirationDate(),
        })
        await tx.insert(passwords).values({
            user_id,
            hash,
        })

        return user_id
    })

    const user = await db.query.users.findFirst({
        with: { connections: true, profiles: true },
        where: eq(users.id, user_id),
    })

    if (!user) {
        throw new Error("failed to create user")
    }

    return await authenticator.authenticate(FORM_STRATEGY, request, {
        successRedirect: "/protected",
        failureRedirect: "/auth/login",
    })
}

export default function Register() {
    return (
        <>
            <Form className="flex flex-col gap-2 p-4" method="post">
                <input
                    className="bg-black p-2"
                    defaultValue="cooper@cxreiff.com"
                    name="email"
                    type="email"
                    placeholder="email address"
                />
                <input
                    className="bg-black p-2"
                    defaultValue="cxreiff"
                    name="alias"
                    type="text"
                    placeholder="user alias"
                />
                <input
                    className="bg-black p-2"
                    defaultValue="mockpass"
                    name="password"
                    type="password"
                    placeholder="password"
                />
                <input
                    className="bg-black p-2"
                    defaultValue="mockpass"
                    name="confirm"
                    type="password"
                    placeholder="confirm password"
                />
                <button type="submit">register</button>
            </Form>
            OR
            <Form action="/auth/github" method="post" className="p-4">
                <button>Login with GitHub</button>
            </Form>
        </>
    )
}
