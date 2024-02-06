import { Card } from "~/ui/primitives/card.tsx"
import { useSuperRouteLoaderData } from "~/lib/superjson.ts"
import { type loader as childLoader } from "~/routes/write+/$gridId+/$resourceType+/$resourceId+/_route.tsx"
import { ResourcePlaceholder } from "~/routes/write+/ui/resourcePlaceholder.tsx"
import { paramsSchema } from "~/routes/write+/$gridId+/$resourceType+/$resourceId+/_route.tsx"
import { useParams } from "@remix-run/react"
import { Image } from "~/ui/image.tsx"
import { canHaveImageAsset } from "~/lib/assets.ts"
import { ImagesDropzone } from "~/routes/write+/ui/image/imagesDropzone.tsx"
import { useAssetUrl } from "~/lib/useAssetUrl.ts"

export function ImagesDisplay() {
    const resource = useSuperRouteLoaderData<typeof childLoader>(
        "routes/write+/$gridId+/$resourceType+/$resourceId+/_route",
    )?.resource
    const { assetUrl, ASSET_FALLBACKS } = useAssetUrl()
    const { resourceType } = paramsSchema.partial().parse(useParams())

    return (
        <Card className="flex h-full items-center justify-center p-4">
            {(function () {
                if (!resource || !resourceType) {
                    return (
                        <ResourcePlaceholder>
                            select a resource
                        </ResourcePlaceholder>
                    )
                }

                if (canHaveImageAsset(resource, resourceType)) {
                    return resource.image_asset ? (
                        <Image
                            src={assetUrl(
                                resource.image_asset,
                                ASSET_FALLBACKS.TILE_IMAGE,
                            )}
                            fade
                            radiusFix
                        />
                    ) : (
                        <ImagesDropzone />
                    )
                }

                return (
                    <ResourcePlaceholder>
                        images cannot be added to this resource type
                    </ResourcePlaceholder>
                )
            })()}
        </Card>
    )
}
