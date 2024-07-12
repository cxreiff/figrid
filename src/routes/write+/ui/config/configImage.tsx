import { TrashIcon } from "@radix-ui/react-icons"
import { Form } from "@remix-run/react"
import { useSuperLoaderData } from "~/lib/superjson.ts"
import { useAssetUrl } from "~/lib/useAssetUrl.ts"
import type { loader } from "~/routes/write+/$gridId+/_route.tsx"
import { ButtonWithIcon } from "~/ui/buttonWithIcon.tsx"
import { Image } from "~/ui/image.tsx"
import { ImageDropzone } from "~/ui/imageDropzone.tsx"
import { LayoutTitled } from "~/ui/layout/layoutTitled.tsx"
import { Card } from "~/ui/primitives/card.tsx"

export function ConfigImage() {
    const { grid } = useSuperLoaderData<typeof loader>()

    const { assetUrl, ASSET_FALLBACKS } = useAssetUrl()

    return (
        <Card className="group relative h-full p-4">
            <LayoutTitled
                title="grid image"
                actionSlot={
                    grid.image_asset_id && (
                        <Form
                            action={`grids/${grid.id}/assets/images/${grid.image_asset_id}/delete`}
                            navigate={false}
                            method="POST"
                        >
                            <ButtonWithIcon
                                icon={TrashIcon}
                                type="submit"
                                className="bg-card hover:bg-accent"
                            />
                        </Form>
                    )
                }
            >
                <div className="h-full min-h-fit rounded-sm border bg-background p-2">
                    {grid.image_asset ? (
                        <Image
                            src={assetUrl(
                                grid.image_asset,
                                ASSET_FALLBACKS.TILE_IMAGE,
                            )}
                            fade
                        />
                    ) : (
                        <ImageDropzone
                            getActionUrl={(label) =>
                                `grids/${grid.id}/assets/images/${label}`
                            }
                        />
                    )}
                </div>
            </LayoutTitled>
        </Card>
    )
}
