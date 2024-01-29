import {
    HeartIcon,
    Pencil2Icon,
    PersonIcon,
    PlayIcon,
    PlusIcon,
} from "@radix-ui/react-icons"
import { Link } from "@remix-run/react"
import type { LoaderFunctionArgs } from "@vercel/remix"
import { auth } from "~/auth/auth.server.ts"
import { ButtonIcon } from "~/components/buttonIcon.tsx"
import { Image } from "~/components/image.tsx"
import { Layout } from "~/components/layout/layout.tsx"
import { Button } from "~/components/ui/button.tsx"
import { Card } from "~/components/ui/card.tsx"
import { db } from "~/database/database.server.ts"
import { GRID_FALLBACK_IMAGE, assetUrl } from "~/lib/assets.ts"
import { superjson, useSuperLoaderData } from "~/lib/superjson.ts"

export async function loader({ request }: LoaderFunctionArgs) {
    const user = await auth.isAuthenticated(request)

    const grids = await db.query.grids.findMany({ with: { image_asset: true } })

    return superjson({ user, grids })
}

export default function Route() {
    const { user, grids } = useSuperLoaderData<typeof loader>()

    return (
        <Layout user={user} title={"dashboard"}>
            <ButtonIcon
                variant="outline"
                className="my-4 h-12 w-full border-dashed"
                icon={PlusIcon}
            >
                create grid
            </ButtonIcon>
            {grids.map((grid) => (
                <Card
                    key={grid.id}
                    className="mb-4 flex w-full items-center bg-card p-2"
                >
                    <Image
                        className="h-12 bg-background shadow-inner"
                        src={assetUrl(grid.image_asset) || GRID_FALLBACK_IMAGE}
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
                    <ButtonIcon variant="ghost" icon={HeartIcon} />
                    <ButtonIcon variant="ghost" icon={PersonIcon} />
                    <div className="ml-4 flex w-[5.8rem] gap-2">
                        {user?.id === grid.user_id && (
                            <>
                                <Button
                                    className="h-12 flex-1"
                                    variant="outline"
                                    asChild
                                >
                                    <Link to={`/write/${grid.id}`}>
                                        <Pencil2Icon />
                                    </Link>
                                </Button>
                                <Button
                                    className="h-12 flex-1"
                                    variant="outline"
                                    asChild
                                >
                                    <Link to={`/read/${grid.id}`}>
                                        <PlayIcon />
                                    </Link>
                                </Button>
                            </>
                        )}
                        {user?.id !== grid.user_id && (
                            <Button
                                variant="outline"
                                className="flex h-12 w-full px-4"
                                asChild
                            >
                                <Link to={`/read/${grid.id}`}>
                                    <h3 className="flex-1">PLAY</h3>
                                    <PlayIcon />
                                </Link>
                            </Button>
                        )}
                    </div>
                </Card>
            ))}
        </Layout>
    )
}
