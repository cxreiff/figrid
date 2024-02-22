import { useSuperRouteLoaderData } from "~/lib/superjson.ts"
import { type loader as childLoader } from "~/routes/write+/$gridId+/$resourceType+/$resourceId+/_index.tsx"
import { ResourcePlaceholder } from "~/routes/write+/ui/resourcePlaceholder.tsx"
import { paramsSchema } from "~/routes/write+/$gridId+/$resourceType+/$resourceId+/_index.tsx"
import { useParams } from "@remix-run/react"
import { Image } from "~/ui/image.tsx"
import { canHaveImageAsset } from "~/lib/assets.ts"
import { ImageDropzone } from "~/routes/write+/ui/details/detailsImageDropzone.tsx"
import { useAssetUrl } from "~/lib/useAssetUrl.ts"
import { DetailsImageRemove } from "~/routes/write+/ui/details/detailsImageRemove.tsx"
import { Card } from "~/ui/primitives/card.tsx"
import { LayoutTitled } from "~/ui/layout/layoutTitled.tsx"

export function DetailsImage() {
    const resource = useSuperRouteLoaderData<typeof childLoader>(
        "routes/write+/$gridId+/$resourceType+/$resourceId+/_index",
    )?.resource
    const { assetUrl, ASSET_FALLBACKS } = useAssetUrl()
    const { resourceType } = paramsSchema.partial().parse(useParams())

    if (!resource || !resourceType) {
        return <ResourcePlaceholder>select a resource</ResourcePlaceholder>
    }

    if (!canHaveImageAsset(resource, resourceType)) {
        return (
            <ResourcePlaceholder>
                images cannot be added to this resource type
            </ResourcePlaceholder>
        )
    }

    return (
        <Card className="group relative h-full p-4">
            <LayoutTitled
                title="image"
                actionSlot={
                    resource.image_asset && (
                        <DetailsImageRemove
                            resourceId={resource.id}
                            imageAssetId={resource.image_asset.id}
                        />
                    )
                }
            >
                <div className="h-full rounded-sm border bg-background">
                    {resource.image_asset ? (
                        <Image
                            src={assetUrl(
                                resource.image_asset,
                                ASSET_FALLBACKS.TILE_IMAGE,
                            )}
                            fade
                        />
                    ) : (
                        <div className="h-full p-4">
                            <ImageDropzone />
                        </div>
                    )}
                </div>
            </LayoutTitled>
        </Card>
    )
}
