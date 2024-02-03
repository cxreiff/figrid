import type { LoaderFunctionArgs } from "@vercel/remix"
import { auth } from "~/auth/auth.server.ts"
import { Layout } from "~/ui/layout/layout.tsx"
import { Card } from "~/ui/primitives/card.tsx"
import { superjson, useSuperLoaderData } from "~/lib/superjson.ts"
import { GridTable } from "~/routes/_index+/ui/gridTable.tsx"
import { COLUMN_DEFINITION } from "~/routes/_index+/lib/columns.ts"
import { listGridsQuery } from "~/routes/_index+/lib/queries.server.ts"

export async function loader({ request }: LoaderFunctionArgs) {
    const user = await auth.isAuthenticated(request)

    const grids = await listGridsQuery()

    return superjson({ user, grids })
}

export default function Route() {
    const { user, grids } = useSuperLoaderData<typeof loader>()

    return (
        <Layout user={user} title={"dashboard"}>
            <div className="flex h-full flex-col gap-3">
                <div className="flex min-h-0 gap-3">
                    <Card className=" flex items-center justify-center p-4">
                        <h3 className="text-lg">welcome to figrid</h3>
                    </Card>
                    <Card className=" flex flex-1 items-center justify-center p-4">
                        carousel
                    </Card>
                    <div className="flex flex-col gap-3">
                        <Card className=" flex flex-1 items-center justify-center p-4">
                            your profile
                        </Card>
                        <Card className=" flex flex-1 items-center justify-center p-4">
                            help & documentation
                        </Card>
                    </div>
                </div>
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
