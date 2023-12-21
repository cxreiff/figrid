import { Button, Card, IconButton } from "@itsmapleleaf/radix-themes"
import { TrashIcon } from "@radix-ui/react-icons"
import { Image } from "~/components/image.tsx"
import { WaitSaveData } from "~/components/waitSaveData.tsx"
import type { loader } from "~/routes/read.$gridId/route.tsx"
import { TILE_FALLBACK_IMAGE } from "~/utilities/misc.ts"
import { useSuperLoaderData } from "~/utilities/superjson.ts"
import { useManualSaveData } from "~/utilities/useManualSaveData.ts"
import { type useSaveData } from "~/utilities/useSaveData.ts"

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
        <WaitSaveData>
            {(saveData) => (
                <>
                    <h3 className="pb-3 text-zinc-500">
                        local
                        <Button
                            className="float-right m-0"
                            variant="ghost"
                            onClick={() =>
                                setManualSave(saves.length, saveData)
                            }
                        >
                            create new...
                        </Button>
                    </h3>
                    {saves
                        .map((save, index) => {
                            const tile = tileIdMap[save.currentTileId]
                            return (
                                <Card key={index} className="mb-4">
                                    <div className="flex h-full items-center">
                                        <Image
                                            key={tile.image_url}
                                            className="mr-4 h-12 w-12"
                                            src={
                                                tile.image_url ||
                                                TILE_FALLBACK_IMAGE
                                            }
                                            alt={"tile"}
                                        />
                                        <span className="grow-1 flex-1 shrink overflow-hidden text-ellipsis whitespace-nowrap">
                                            {save.characterName} - {tile.name}
                                        </span>
                                        <Button
                                            className="ml-4"
                                            variant="outline"
                                            onClick={() => replaceSave(save)}
                                        >
                                            load
                                        </Button>
                                        <Button
                                            className="ml-4"
                                            variant="outline"
                                            onClick={() =>
                                                setManualSave(index, saveData)
                                            }
                                        >
                                            save
                                        </Button>
                                        <IconButton
                                            variant="ghost"
                                            className="ml-4 mr-2"
                                            onClick={() => deleteSave(index)}
                                        >
                                            <TrashIcon />
                                        </IconButton>
                                    </div>
                                </Card>
                            )
                        })
                        .reverse()}
                </>
            )}
        </WaitSaveData>
    )
}
