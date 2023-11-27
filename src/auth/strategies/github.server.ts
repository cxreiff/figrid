import { eq } from "drizzle-orm"
import { GitHubStrategy } from "remix-auth-github"
import { z } from "zod"
import { getSessionExpirationDate } from "~/auth/authenticator.server"
import { db } from "~/utilities/database.server"
import {
    connections,
    profiles,
    sessions,
    users,
} from "~/utilities/schema.server"

export const GITHUB_STRATEGY = "GITHUB_STRATEGY"

export const gitHubStrategy = new GitHubStrategy(
    {
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        callbackURL:
            process.env.NODE_ENV === "production"
                ? "https://figrid.io/auth/github/callback"
                : "http://localhost:3000/auth/github/callback",
    },
    async ({ profile }) => {
        const email = profile.emails[0].value

        let user = await db.query.users.findFirst({
            with: { connections: true, profiles: true },
            where: eq(users.email, profile.emails[0].value),
        })

        if (!user) {
            let newUser = {
                email,
                alias: profile.displayName,
                name: profile.name.givenName,
            }
            const response = await db.insert(users).values(newUser)
            const { insertId: user_id } = z
                .object({ insertId: z.coerce.number() })
                .parse(response)

            await db.insert(profiles).values({
                user_id,
                image_url: profile.photos?.[0].value,
            })
            user = await db.query.users.findFirst({
                with: { connections: true, profiles: true },
                where: eq(users.id, user_id),
            })
        }

        if (!user) {
            throw Error("failed to create a user")
        }

        if (
            !user.connections
                .map((connection) => connection.provider_name)
                .includes(GITHUB_STRATEGY)
        ) {
            await db.insert(connections).values({
                user_id: user.id,
                provider_id: profile.id,
                provider_name: GITHUB_STRATEGY,
            })
        }

        await db.insert(sessions).values({
            user_id: user.id,
            expiration_date: getSessionExpirationDate(),
        })

        return {
            alias: user.alias,
            email: user.email,
            name: user.name,
            type: user.type,
            profile: user.profiles,
        }
    },
)
