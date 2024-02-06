import { Image } from "~/ui/image.tsx"
import { WaitSaveData } from "~/ui/waitSaveData.tsx"
import type { loader } from "~/routes/read+/$gridId.tsx"
import { useSuperLoaderData } from "~/lib/superjson.ts"
import { useAssetUrl } from "~/lib/useAssetUrl.ts"

export function StatusImage() {
    const { grid } = useSuperLoaderData<typeof loader>()
    const { assetUrl, ASSET_FALLBACKS } = useAssetUrl()

    return (
        <WaitSaveData className="h-full w-full">
            {() => {
                const image = assetUrl(
                    grid.player.image_asset,
                    ASSET_FALLBACKS.CHARACTER_IMAGE,
                )
                return (
                    <div className="flex h-full items-center justify-center">
                        <Image
                            key={image}
                            src={image}
                            alt="placeholder"
                            fade
                            radiusFix
                        />
                    </div>
                )
            }}
        </WaitSaveData>
    )
}
