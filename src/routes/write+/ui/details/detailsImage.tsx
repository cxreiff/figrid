import { useSuperRouteLoaderData } from "~/lib/superjson.ts"
import { type loader as childLoader } from "~/routes/write+/$gridId+/$resourceType+/$resourceId+/_index.tsx"
import { Placeholder } from "~/ui/placeholder.tsx"
import { paramsSchema } from "~/routes/write+/$gridId+/$resourceType+/$resourceId+/_index.tsx"
import { useParams } from "@remix-run/react"
import { Image } from "~/ui/image.tsx"
import { canHaveImageAsset } from "~/lib/assets.ts"
import { useAssetUrl } from "~/lib/useAssetUrl.ts"
import { DetailsImageRemove } from "~/routes/write+/ui/details/detailsImageRemove.tsx"
import { Card } from "~/ui/primitives/card.tsx"
import { LayoutTitled } from "~/ui/layout/layoutTitled.tsx"
import { ImageDropzone } from "~/ui/imageDropzone.tsx"

export function DetailsImage() {
    const resource = useSuperRouteLoaderData<typeof childLoader>(
        "routes/write+/$gridId+/$resourceType+/$resourceId+/_index",
    )?.resource
    const { assetUrl, ASSET_FALLBACKS } = useAssetUrl()
    const { resourceType } = paramsSchema.partial().parse(useParams())

    return (
        <Card className="group relative h-full p-4">
            {(() => {
                if (!resource || !resourceType) {
                    return <Placeholder>select a resource</Placeholder>
                }

                if (!canHaveImageAsset(resource, resourceType)) {
                    return (
                        <Placeholder>
                            images cannot be added to this resource type
                        </Placeholder>
                    )
                }

                return (
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
                        <div className="h-full min-h-fit rounded-sm border bg-background p-2">
                            {resource.image_asset ? (
                                <Image
                                    src={assetUrl(
                                        resource.image_asset,
                                        ASSET_FALLBACKS.TILE_IMAGE,
                                    )}
                                    fade
                                />
                            ) : (
                                <ImageDropzone
                                    getActionUrl={(label) =>
                                        `${resourceType}/${resource.id}/assets/images/${label}`
                                    }
                                />
                            )}
                        </div>
                    </LayoutTitled>
                )
            })()}
        </Card>
    )
}
