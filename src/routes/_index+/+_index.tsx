import { HeartIcon, Pencil2Icon, PlayIcon } from "@radix-ui/react-icons"
import type { LoaderFunctionArgs } from "@vercel/remix"
import { auth } from "~/auth/auth.server.ts"
import { ButtonWithIcon } from "~/components/buttonWithIcon.tsx"
import { ButtonWithIconLink } from "~/components/buttonWithIconLink.tsx"
import { Image } from "~/components/image.tsx"
import { Layout } from "~/components/layout/layout.tsx"
import { Scroller } from "~/components/scroller.tsx"
import { Button } from "~/components/ui/button.tsx"
import { Card } from "~/components/ui/card.tsx"
import { db } from "~/database/database.server.ts"
import { GRID_FALLBACK_IMAGE, assetUrl } from "~/lib/assets.ts"
import { superjson, useSuperLoaderData } from "~/lib/superjson.ts"
import { COLUMN_DEFINITION } from "~/routes/_index+/lib/columns.ts"
import { GridTable } from "~/routes/_index+/ui/gridTable.tsx"

export async function loader({ request }: LoaderFunctionArgs) {
    const user = await auth.isAuthenticated(request)

    const grids = await db.query.grids.findMany({
        with: { image_asset: true, user: true },
    })

    return superjson({ user, grids })
}

export default function Route() {
    const { user, grids } = useSuperLoaderData<typeof loader>()

    return (
        <Layout user={user} title={"dashboard"}>
            <div className="mb-4 flex min-h-0 flex-1 gap-4">
                <Card className=" flex items-center justify-center p-4">
                    <h3 className="text-lg">welcome to figrid</h3>
                </Card>
                <Card className=" flex flex-1 items-center justify-center p-4">
                    carousel
                </Card>
                <div className="flex flex-col gap-4">
                    <Card className=" flex flex-1 items-center justify-center p-4">
                        your profile
                    </Card>
                    <Card className=" flex flex-1 items-center justify-center p-4">
                        help & documentation
                    </Card>
                </div>
            </div>
            <div className="min-h-0 flex-1">
                <GridTable data={grids} columns={COLUMN_DEFINITION} />
                <Scroller className="mt-4">
                    {grids.map((grid) => (
                        <Card
                            key={grid.id}
                            className="mb-4 flex w-full items-center bg-card p-2 shadow-sm"
                        >
                            <Image
                                className="h-12 w-12 bg-background shadow-inner"
                                src={
                                    assetUrl(grid.image_asset) ||
                                    GRID_FALLBACK_IMAGE
                                }
                            />
                            <h3 className="flex flex-1 items-center px-4">
                                {grid.name}
                                <span className="ml-4 text-muted">—</span>
                                <span className="ml-4 text-muted-foreground">
                                    {grid.summary}
                                </span>
                                <span className="ml-4 text-muted">—</span>
                                <span className="ml-4 text-muted-foreground">
                                    {grid.description}
                                </span>
                            </h3>
                            <Button>@{grid.user.alias}</Button>
                            <ButtonWithIcon icon={HeartIcon} />
                            <div className="ml-4 flex w-[5.8rem] gap-2">
                                {user?.id === grid.user_id && (
                                    <>
                                        <ButtonWithIconLink
                                            className="h-12 flex-1"
                                            variant="outline"
                                            to={`/write/${grid.id}`}
                                            icon={Pencil2Icon}
                                        />
                                        <ButtonWithIconLink
                                            className="h-12 flex-1"
                                            variant="outline"
                                            to={`/write/${grid.id}`}
                                            icon={PlayIcon}
                                        />
                                    </>
                                )}
                                {user?.id !== grid.user_id && (
                                    <ButtonWithIconLink
                                        className="h-12 w-full flex-1"
                                        variant="outline"
                                        to={`/write/${grid.id}`}
                                        icon={PlayIcon}
                                    >
                                        PLAY
                                    </ButtonWithIconLink>
                                )}
                            </div>
                        </Card>
                    ))}
                </Scroller>
            </div>
        </Layout>
    )
}
