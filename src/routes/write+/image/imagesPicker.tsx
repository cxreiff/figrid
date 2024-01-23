import { Card } from "~/components/ui/card.tsx"
import { useSuperLoaderData } from "~/lib/superjson.ts"
import type { loader } from "~/routes/write+/+$gridId.tsx"
import { paramsSchema } from "~/routes/write+/$gridId+/$resourceType+/+$resourceId.tsx"
import { useParams } from "@remix-run/react"
import { Image } from "~/components/image.tsx"
import { assetUrl } from "~/lib/assets.ts"
import { Scroller } from "~/components/scroller.tsx"

export function ImagesPicker() {
    const { resourceType } = paramsSchema.partial().parse(useParams())
    const { grid } = useSuperLoaderData<typeof loader>()

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
                        <div key={asset.id} className="text-center">
                            <Image
                                id={`asset-${asset.id}`}
                                src={assetUrl(asset)}
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
