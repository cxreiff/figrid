import { Image } from "~/components/image.tsx"
import { WaitSaveData } from "~/components/waitSaveData.tsx"
import type { loader } from "~/routes/read+/+$gridId.tsx"
import { useSuperLoaderData } from "~/lib/superjson.ts"
import { PLAYER_FALLBACK_IMAGE, assetUrl } from "~/lib/assets.ts"

export function StatusImage() {
    const { grid } = useSuperLoaderData<typeof loader>()
    return (
        <WaitSaveData className="h-full w-full">
            {() => {
                const image =
                    assetUrl(grid.player.image_asset) || PLAYER_FALLBACK_IMAGE
                return (
                    <div className="flex h-full items-center justify-center">
                        <Image key={image} src={image} alt="placeholder" />
                    </div>
                )
            }}
        </WaitSaveData>
    )
}
