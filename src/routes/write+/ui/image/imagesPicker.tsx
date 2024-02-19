import { Card } from "~/ui/primitives/card.tsx"
import { useSuperLoaderData } from "~/lib/superjson.ts"
import type { loader } from "~/routes/write+/$gridId+/_route.tsx"
import { paramsSchema } from "~/routes/write+/$gridId+/$resourceType+/$resourceId+/_index.tsx"
import { useParams } from "@remix-run/react"
import { Image } from "~/ui/image.tsx"
import { Scroller } from "~/ui/scroller.tsx"
import { useAssetUrl } from "~/lib/useAssetUrl.ts"

export function ImagesPicker() {
    const { resourceType } = paramsSchema.partial().parse(useParams())
    const { grid } = useSuperLoaderData<typeof loader>()
    const { assetUrl } = useAssetUrl()

    return (
        <Card className="h-full p-4">
            <Scroller className="grid grid-cols-3 gap-3">
                {grid.assets
                    .filter(
                        ({ resource_type, asset_type }) =>
                            resource_type === resourceType &&
                            asset_type === "images",
                    )
                    .map((asset) => (
                        <div key={asset.id} className="h-20 text-center">
                            <Image
                                id={`asset-${asset.id}`}
                                src={assetUrl(asset)}
                                fade
                                radiusFix
                            />
                            <label htmlFor={`asset-${asset.id}`}>
                                {asset.label}
                            </label>
                        </div>
                    ))}
            </Scroller>
        </Card>
    )
}
