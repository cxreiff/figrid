import { Card } from "~/components/ui/card.tsx"
import { useSuperMatch } from "~/lib/superjson.ts"
import { type loader as childLoader } from "~/routes/write+/$gridId+/+$resourceType.$resourceId.tsx"
import {
    type WriteCharacterQuery,
    type WriteEventQuery,
    type WriteGateQuery,
    type WriteItemQuery,
    type WriteLockQuery,
    type WriteTileQuery,
} from "~/routes/write+/queries.server.ts"
import { ResourcePlaceholder } from "~/routes/write+/resourcePlaceholder.tsx"
import { paramsSchema } from "~/routes/write+/$gridId+/+$resourceType.$resourceId.tsx"
import { useParams } from "@remix-run/react"
import type { ResourceType } from "~/routes/write+/+$gridId.tsx"
import { Image } from "~/components/image.tsx"
import { TILE_FALLBACK_IMAGE, assetUrl } from "~/lib/assets.ts"

export function AssetsImages() {
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
                    return (
                        <Image
                            src={
                                assetUrl(resource.image_asset) ||
                                TILE_FALLBACK_IMAGE
                            }
                        />
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

function canHaveImageAsset(
    _:
        | WriteCharacterQuery
        | WriteEventQuery
        | WriteGateQuery
        | WriteItemQuery
        | WriteTileQuery
        | WriteLockQuery,
    resourceType: ResourceType,
): _ is
    | WriteCharacterQuery
    | WriteEventQuery
    | WriteItemQuery
    | WriteTileQuery {
    return ["characters", "events", "items", "tiles"].includes(resourceType)
}
