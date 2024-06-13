import { redirect, type LoaderFunctionArgs } from "@vercel/remix"
import { auth } from "~/auth/auth.server.ts"
import { Layout } from "~/ui/layout/layout.tsx"
import { superjson, useSuperLoaderData } from "~/lib/superjson.ts"
import { GridTable } from "~/routes/_index+/ui/gridTable.tsx"
import { GRID_COLUMN_DEFINITIONS } from "~/routes/_index+/lib/columns.ts"
import { listGridsQuery } from "~/routes/_index+/lib/queries.server.ts"
import { SiteDescription } from "~/routes/_index+/ui/siteDescription.tsx"
import { db } from "~/database/database.server.ts"
import { grids } from "~/database/schema/grids.server.ts"
import { withZod } from "@remix-validated-form/with-zod"
import { z } from "zod"
import { validationError } from "remix-validated-form"
import { tiles } from "~/database/schema/tiles.server.ts"
import { characters } from "~/database/schema/characters.server.ts"
import { and, eq } from "drizzle-orm"

export const formSchema = withZod(
    z.object({
        name: z.string().min(1, { message: "name is required" }),
        summary: z.string(),
    }),
)

export async function loader({ request }: LoaderFunctionArgs) {
    const user = await auth.isAuthenticated(request)

    const grids = await listGridsQuery()

    return superjson({ user, grids })
}

export async function action({ request }: LoaderFunctionArgs) {
    const user = await auth.isAuthenticated(request, {
        failureRedirect: "/auth/login",
    })

    const data = await formSchema.validate(await request.formData())

    if (data.error) {
        return validationError(data.error)
    }

    let gridId = await db.transaction(async (tx) => {
        const [{ gridId }] = await tx
            .insert(grids)
            .values({
                user_id: user.id,
                first_tile_id: 0,
                player_id: 0,
                name: data.data.name,
                summary: data.data.summary,
            })
            .returning({ gridId: grids.id })

        const [{ firstTileId }] = await tx
            .insert(tiles)
            .values({
                user_id: user.id,
                grid_id: Number(gridId),
                name: "first tile",
            })
            .returning({ firstTileId: grids.id })

        const [{ playerId }] = await tx
            .insert(characters)
            .values({
                user_id: user.id,
                grid_id: Number(gridId),
                name: "player",
            })
            .returning({ playerId: grids.id })

        await tx
            .update(grids)
            .set({
                first_tile_id: Number(firstTileId),
                player_id: Number(playerId),
            })
            .where(and(eq(grids.id, Number(gridId))))

        return gridId
    })

    return redirect(`/write/${gridId}/`)
}

export default function Route() {
    const { user, grids } = useSuperLoaderData<typeof loader>()

    return (
        <Layout user={user}>
            <div className="flex h-full flex-col gap-3">
                <SiteDescription />
                <div className="-mb-4 mt-3 min-h-0 flex-1">
                    <GridTable
                        user={user}
                        grids={grids}
                        columns={GRID_COLUMN_DEFINITIONS}
                    />
                </div>
            </div>
        </Layout>
    )
}
