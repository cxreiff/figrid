import { PlusIcon, TrashIcon } from "@radix-ui/react-icons"
import { Image } from "~/components/image.tsx"
import { Button } from "~/components/ui/button.tsx"
import { Card } from "~/components/ui/card.tsx"
import { WaitSaveData } from "~/components/waitSaveData.tsx"
import type { loader } from "~/routes/read+/+$gridId.tsx"
import { useSuperLoaderData } from "~/lib/superjson.ts"
import { useManualSaveData } from "~/lib/useManualSaveData.ts"
import { type useSaveData } from "~/lib/useSaveData.ts"
import { LayoutTitledScrolls } from "~/components/layout/layoutTitledScrolls.tsx"
import { TILE_FALLBACK_IMAGE, assetUrl } from "~/lib/assets.ts"

export function DataLocal({
    replaceSave,
}: {
    replaceSave: ReturnType<typeof useSaveData>[2]
}) {
    const { user, grid, tileIdMap } = useSuperLoaderData<typeof loader>()
    const [saves, setManualSave, deleteSave] = useManualSaveData(
        user?.id || 0,
        grid.id,
    )

    return (
        <LayoutTitledScrolls
            title="local"
            actionSlot={
                <WaitSaveData>
                    {(saveData) => (
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() =>
                                setManualSave(saves.length, saveData)
                            }
                        >
                            <PlusIcon />
                        </Button>
                    )}
                </WaitSaveData>
            }
        >
            {saves
                .map((save, index) => {
                    const tile = tileIdMap[save.currentTileId]
                    return (
                        <WaitSaveData key={index} className="h-full">
                            {(saveData) => (
                                <Card key={index} className="mb-4">
                                    <div className="flex h-full items-center p-2">
                                        <Image
                                            key={tile.image_asset_id}
                                            className="mr-4 h-12 w-12"
                                            src={
                                                assetUrl(tile.image_asset) ||
                                                TILE_FALLBACK_IMAGE
                                            }
                                            alt={"tile"}
                                        />
                                        <span className="grow-1 flex-1 shrink overflow-hidden text-ellipsis whitespace-nowrap">
                                            {save.characterName} - {tile.name}
                                        </span>
                                        <Button
                                            className="ml-4"
                                            variant="ghost"
                                            onClick={() => replaceSave(save)}
                                        >
                                            load
                                        </Button>
                                        <Button
                                            className="ml-4"
                                            variant="ghost"
                                            onClick={() =>
                                                setManualSave(index, saveData)
                                            }
                                        >
                                            save
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="ml-4 mr-2"
                                            onClick={() => deleteSave(index)}
                                        >
                                            <TrashIcon />
                                        </Button>
                                    </div>
                                </Card>
                            )}
                        </WaitSaveData>
                    )
                })
                .reverse()}
        </LayoutTitledScrolls>
    )
}
