import { Button, IconButton } from "@itsmapleleaf/radix-themes"
import { TrashIcon } from "@radix-ui/react-icons"
import { Card } from "~/components/card.tsx"
import { Image } from "~/components/image.tsx"
import { Wait } from "~/components/wait.tsx"
import { TILE_FALLBACK_IMAGE } from "~/routes/read.$gridId/area.tsx"
import type {
    IdMap,
    TileWithCoords,
} from "~/routes/read.$gridId/processing.server.ts"
import { useManualSaveData } from "~/utilities/useManualSaveData.ts"
import { type useSaveData, type SaveData } from "~/utilities/useSaveData.ts"

export function Data({
    userId,
    gridId,
    tileIdMap,
    saveData,
    replaceSave,
}: {
    userId: number
    gridId: number
    tileIdMap: IdMap<TileWithCoords>
    saveData?: SaveData
    replaceSave: ReturnType<typeof useSaveData>[2]
}) {
    const [saves, setManualSave, deleteSave] = useManualSaveData(userId, gridId)

    return (
        <Card className="h-full pt-4">
            <Wait on={saveData}>
                {(saveData) => {
                    return (
                        <div className="h-full overflow-auto px-5">
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
                                                    {save.characterName} -{" "}
                                                    {tile.name}
                                                </span>
                                                <Button
                                                    className="ml-4"
                                                    variant="outline"
                                                    onClick={() =>
                                                        replaceSave(save)
                                                    }
                                                >
                                                    load
                                                </Button>
                                                <Button
                                                    className="ml-4"
                                                    variant="outline"
                                                    onClick={() =>
                                                        setManualSave(
                                                            index,
                                                            saveData,
                                                        )
                                                    }
                                                >
                                                    save
                                                </Button>
                                                <IconButton
                                                    variant="ghost"
                                                    className="ml-4 mr-2"
                                                    onClick={() =>
                                                        deleteSave(index)
                                                    }
                                                >
                                                    <TrashIcon />
                                                </IconButton>
                                            </div>
                                        </Card>
                                    )
                                })
                                .reverse()}
                        </div>
                    )
                }}
            </Wait>
        </Card>
    )
}
