import { Image } from "~/components/image.tsx"
import type { loader } from "~/routes/read.$gridId/route.tsx"
import { WaitSaveData } from "~/components/waitSaveData.tsx"
import { TILE_FALLBACK_IMAGE } from "~/utilities/misc.ts"
import { useSuperLoaderData } from "~/utilities/superjson.ts"

export function AreaImage() {
    const { tileIdMap, eventIdMap } = useSuperLoaderData<typeof loader>()
    return (
        <WaitSaveData className="h-full w-full">
            {(saveData) => {
                const tile = tileIdMap[saveData.currentTileId]
                const eventImage =
                    saveData.currentEventId &&
                    eventIdMap[saveData.currentEventId].image_url
                const image =
                    eventImage || tile.image_url || TILE_FALLBACK_IMAGE
                return (
                    <div className="flex h-full items-center justify-center">
                        <Image key={image} src={image} alt="placeholder" />
                    </div>
                )
            }}
        </WaitSaveData>
    )
}
