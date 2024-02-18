import type { AuthUser } from "~/auth/auth.server.ts"
import { useAssetUrl } from "~/lib/useAssetUrl.ts"
import type { ListGridsQuery } from "~/routes/_index+/lib/queries.server.ts"
import { GridEnterButton } from "~/routes/_index+/ui/gridEnterButton.tsx"
import { GridInfo } from "~/routes/_index+/ui/gridInfo.tsx"
import { Image } from "~/ui/image.tsx"
import { LikeButton } from "~/ui/likeButton.tsx"
import { Card } from "~/ui/primitives/card.tsx"

export function GridCard({
    user,
    grid,
}: {
    user: AuthUser | null
    grid: ListGridsQuery[0]
}) {
    const { assetUrl, ASSET_FALLBACKS } = useAssetUrl()

    const liked = user
        ? !!grid.likes.find(({ user_id }) => user_id === user.id)
        : undefined

    return (
        <Card
            key={grid.id}
            className="mb-3 flex w-full gap-2 bg-card p-2 shadow-sm last:mb-0"
        >
            <span className="flex-0 flex flex-col sm:flex-row">
                <Image
                    className="flex-0 mr-2 aspect-square h-12 bg-background shadow-inner"
                    src={assetUrl(grid.image_asset, ASSET_FALLBACKS.GRID_IMAGE)}
                />
                <LikeButton
                    liked={liked}
                    likes={grid.likes.length}
                    gridId={grid.id}
                />
            </span>
            <GridInfo
                name={grid.name}
                alias={grid.user.alias}
                summary={grid.summary ?? undefined}
            />
            <GridEnterButton
                gridId={grid.id}
                canEdit={user?.id === grid.user_id}
            />
        </Card>
    )
}
