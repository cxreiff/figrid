import { Button, Table } from "@itsmapleleaf/radix-themes"
import { Wait } from "~/components/wait.tsx"
import type {
    CharactersSelectModel,
    ItemInstancesSelectModel,
    ItemsSelectModel,
} from "~/database/schema/grids.server.ts"
import type { IdMap } from "~/routes/read.$gridId/processing.ts"
import type { SaveData } from "~/utilities/useSaveData.ts"

const PLAYER_FALLBACK_IMAGE = "https://img.figrid.io/tiles/kitty.png"

export function InfoStatus({
    saveData,
    player,
    itemIdMap,
    itemInstanceIdMap,
    handleCommand,
}: {
    saveData?: SaveData
    player: CharactersSelectModel
    itemIdMap: IdMap<ItemsSelectModel>
    itemInstanceIdMap: IdMap<ItemInstancesSelectModel>
    handleCommand: (command: string) => void
}) {
    return (
        <Wait on={saveData}>
            {(saveData) => {
                const image = player.image_url || PLAYER_FALLBACK_IMAGE
                return (
                    <>
                        <div className="flex h-3/5 items-center justify-center pb-8">
                            <img
                                key={image}
                                src={image}
                                alt="placeholder"
                                className="pixel-image m-auto h-full max-w-full rounded-lg object-contain duration-500 animate-in fade-in"
                            />
                        </div>
                        <div className="h-2/5 overflow-auto px-5">
                            <Table.Root className="pb-8">
                                <Table.Body className="text-center align-middle">
                                    {saveData.heldItems.map((instanceId) => {
                                        const item =
                                            itemIdMap[
                                                itemInstanceIdMap[instanceId]
                                                    .item_id
                                            ]
                                        return (
                                            <Table.Row
                                                key={item.id}
                                                className="duration-500 animate-in fade-in"
                                            >
                                                <Table.RowHeaderCell>
                                                    {item.name}
                                                </Table.RowHeaderCell>
                                                <Table.Cell>
                                                    {item.summary}
                                                </Table.Cell>
                                                <Table.Cell>
                                                    <Button
                                                        variant="ghost"
                                                        className="cursor-pointer"
                                                        onClick={() =>
                                                            handleCommand(
                                                                `look ${item.name.toLowerCase()}`,
                                                            )
                                                        }
                                                    >
                                                        look
                                                    </Button>
                                                </Table.Cell>
                                            </Table.Row>
                                        )
                                    })}
                                </Table.Body>
                            </Table.Root>
                        </div>
                    </>
                )
            }}
        </Wait>
    )
}
