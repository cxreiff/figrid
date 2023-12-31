import {
    AvatarIcon,
    EnvelopeClosedIcon,
    GitHubLogoIcon,
    LockClosedIcon,
} from "@radix-ui/react-icons"
import { Form } from "@remix-run/react"
import { type ActionFunctionArgs, type LoaderFunctionArgs } from "@vercel/remix"
import { eq, or } from "drizzle-orm"
import { z } from "zod"
import {
    auth,
    getSessionExpirationDate,
    hashPassword,
} from "~/auth/auth.server.ts"
import { FORM_STRATEGY } from "~/auth/strategies/form.server.ts"
import { Button } from "~/components/ui/button.tsx"
import { IconInput } from "~/components/ui/input.tsx"
import { Separator } from "~/components/ui/separator.tsx"
import { db } from "~/database/database.server.ts"
import {
    passwords,
    profiles,
    sessions,
    users,
} from "~/database/schema/auth.server.ts"

export async function loader({ request }: LoaderFunctionArgs) {
    return auth.isAuthenticated(request, {
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

    await db.transaction(async (tx) => {
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

    return await auth.authenticate(FORM_STRATEGY, request, {
        successRedirect: "/protected",
        failureRedirect: "/auth/login",
    })
}

export default function Register() {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center">
            <Form action="/auth/github" method="post" className="w-72">
                <Button
                    type="submit"
                    variant="outline"
                    className="relative w-full"
                >
                    <GitHubLogoIcon className="absolute left-3" />
                    <span className="w-full px-10">Login with GitHub</span>
                </Button>
            </Form>
            <Separator className="my-4 w-64" />
            <Form className="flex w-72 flex-col gap-2" method="post">
                <IconInput
                    className="mb-2"
                    icon={EnvelopeClosedIcon}
                    name="email"
                    type="email"
                    placeholder="email address"
                />
                <IconInput
                    className="mb-2"
                    icon={AvatarIcon}
                    name="alias"
                    type="text"
                    placeholder="user alias"
                />
                <IconInput
                    className="mb-2"
                    icon={LockClosedIcon}
                    name="password"
                    type="password"
                    placeholder="password"
                />
                <IconInput
                    className="mb-2"
                    icon={LockClosedIcon}
                    name="confirm"
                    type="password"
                    placeholder="confirm password"
                />
                <Button type="submit" variant="outline">
                    register
                </Button>
            </Form>
        </div>
    )
}
