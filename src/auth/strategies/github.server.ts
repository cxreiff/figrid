import { eq } from "drizzle-orm"
import { GitHubStrategy } from "remix-auth-github"
import { db } from "~/utilities/database.server"
import { connections, users } from "~/utilities/schema.server"

export const GITHUB_STRATEGY = "GITHUB_STRATEGY"

export const gitHubStrategy = new GitHubStrategy(
    {
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        callbackURL: "https://figrid.io/auth/github/callback",
    },
    async ({ profile }) => {
        const email = profile.emails[0].value

        let user = await db.query.users.findFirst({
            with: { connections: true },
            where: eq(users.email, profile.emails[0].value),
        })

        if (!user) {
            let newUser = {
                email,
                alias: profile.displayName,
                name: profile.name.givenName,
            }
            const { insertId: user_id } = await db.insert(users).values(newUser)
            await db.insert(connections).values({
                user_id: Number(user_id),
                provider_id: profile.id.toString(),
                provider_name: GITHUB_STRATEGY,
            })
            user = await db.query.users.findFirst({
                with: { connections: true },
                where: eq(users.id, Number(user_id)),
            })
        }

        if (!user) {
            throw Error("failed to authenticate")
        }

        return user
    },
)
