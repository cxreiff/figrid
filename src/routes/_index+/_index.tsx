import type { LoaderFunctionArgs } from "@vercel/remix"
import { auth } from "~/auth/auth.server.ts"
import { Layout } from "~/ui/layout/layout.tsx"
import { superjson, useSuperLoaderData } from "~/lib/superjson.ts"
import { GridTable } from "~/routes/_index+/ui/gridTable.tsx"
import { COLUMN_DEFINITION } from "~/routes/_index+/lib/columns.ts"
import { listGridsQuery } from "~/routes/_index+/lib/queries.server.ts"
import { Separator } from "~/ui/primitives/separator.tsx"
import { SiteDescription } from "~/routes/_index+/ui/siteDescription.tsx"

export async function loader({ request }: LoaderFunctionArgs) {
    const user = await auth.isAuthenticated(request)

    const grids = await listGridsQuery()

    return superjson({ user, grids })
}

export default function Route() {
    const { user, grids } = useSuperLoaderData<typeof loader>()

    return (
        <Layout user={user}>
            <div className="flex h-full flex-col gap-3">
                <SiteDescription />
                <Separator />
                <div className="-mb-4 mt-3 min-h-0 flex-1">
                    <GridTable
                        user={user}
                        grids={grids}
                        columns={COLUMN_DEFINITION}
                    />
                </div>
            </div>
        </Layout>
    )
}
