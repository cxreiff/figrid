import { Image } from "~/components/image.tsx"
import type { loader } from "~/routes/read+/+$gridId.tsx"
import { WaitSaveData } from "~/components/waitSaveData.tsx"
import { useSuperLoaderData } from "~/lib/superjson.ts"
import { TILE_FALLBACK_IMAGE, assetUrl } from "~/lib/assets.ts"

export function AreaImage() {
    const { tileIdMap, eventIdMap } = useSuperLoaderData<typeof loader>()
    return (
        <WaitSaveData className="h-full w-full">
            {(saveData) => {
                const tile = tileIdMap[saveData.currentTileId]
                const eventImage =
                    saveData.currentEventId &&
                    assetUrl(eventIdMap[saveData.currentEventId].image_asset)
                const image =
                    eventImage ||
                    assetUrl(tile.image_asset) ||
                    TILE_FALLBACK_IMAGE
                return (
                    <div className="flex h-full items-center justify-center">
                        <Image key={image} src={image} alt="placeholder" />
                    </div>
                )
            }}
        </WaitSaveData>
    )
}
