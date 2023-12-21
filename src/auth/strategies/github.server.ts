import { and, eq } from "drizzle-orm"
import { GitHubStrategy } from "remix-auth-github"
import { z } from "zod"
import { getSessionExpirationDate } from "~/auth/auth.server.ts"
import { db } from "~/database/database.server.ts"
import {
    connections,
    profiles,
    sessions,
    users,
} from "~/database/schema/auth.server.ts"

export const GITHUB_STRATEGY = "GITHUB_STRATEGY"

const queryResponseParser = z.object({ insertId: z.coerce.number() })

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

        let connection = await db.query.connections.findFirst({
            with: { user: { with: { profile: true } } },
            where: and(
                eq(connections.provider_id, profile.id),
                eq(connections.provider_name, GITHUB_STRATEGY),
            ),
        })

        let user = connection?.user

        if (!connection) {
            const { insertId: user_id } = queryResponseParser.parse(
                await db.insert(users).values({
                    email,
                    alias: profile.displayName,
                    name: profile.name.givenName,
                }),
            )
            await db.insert(profiles).values({
                user_id,
                image_url: profile.photos?.[0].value,
            })
            await db.insert(connections).values({
                user_id,
                provider_id: profile.id,
                provider_name: GITHUB_STRATEGY,
            })
            user = await db.query.users.findFirst({
                with: { profile: true },
                where: eq(users.id, user_id),
            })
        }

        if (!user) {
            throw Error("failed to create a user")
        }

        await db.insert(sessions).values({
            user_id: user.id,
            expiration_date: getSessionExpirationDate(),
        })

        return {
            id: user.id,
            alias: user.alias,
            email: user.email,
            name: user.name,
            type: user.type,
            profile: user.profile,
        }
    },
)
