import { Image } from "~/ui/image.tsx"
import type { loader } from "~/routes/read+/$gridId.tsx"
import { WaitSaveData } from "~/ui/waitSaveData.tsx"
import { useSuperLoaderData } from "~/lib/superjson.ts"
import { useAssetUrl } from "~/lib/useAssetUrl.ts"

export function AreaImage() {
    const { tileIdMap, eventIdMap } = useSuperLoaderData<typeof loader>()
    const { assetUrl, ASSET_FALLBACKS } = useAssetUrl()

    return (
        <WaitSaveData className="h-full w-full">
            {(saveData) => {
                const tile = tileIdMap[saveData.currentTileId]
                const eventImage =
                    saveData.currentEventId &&
                    assetUrl(
                        eventIdMap[saveData.currentEventId].image_asset,
                        ASSET_FALLBACKS.TILE_IMAGE,
                    )
                const image =
                    eventImage ||
                    assetUrl(tile.image_asset, ASSET_FALLBACKS.TILE_IMAGE)

                return (
                    <div className="flex h-full items-center justify-center">
                        <Image key={image} src={image} alt="placeholder" fade />
                    </div>
                )
            }}
        </WaitSaveData>
    )
}
