import { Card } from "~/components/ui/card.tsx"
import { useSuperMatch } from "~/lib/superjson.ts"
import { type loader as childLoader } from "~/routes/write+/$gridId+/$resourceType+/+$resourceId.tsx"
import { ResourcePlaceholder } from "~/routes/write+/resourcePlaceholder.tsx"
import { paramsSchema } from "~/routes/write+/$gridId+/$resourceType+/+$resourceId.tsx"
import { useParams } from "@remix-run/react"
import { Image } from "~/components/image.tsx"
import {
    TILE_FALLBACK_IMAGE,
    assetUrl,
    canHaveImageAsset,
} from "~/lib/assets.ts"
import { ImagesDropzone } from "~/routes/write+/image/imagesDropzone.tsx"

export function ImagesDisplay() {
    const resource = useSuperMatch<typeof childLoader>(
        "write.$gridId.$resourceType.$resourceId",
    )?.resource
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
                            src={
                                assetUrl(resource.image_asset) ||
                                TILE_FALLBACK_IMAGE
                            }
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
