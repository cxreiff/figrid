import { Button, Table } from "@itsmapleleaf/radix-themes"
import { Card } from "~/components/card.tsx"
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
        <>
            <Card className="no-card-padding mb-4 h-1/2 bg-zinc-950">
                <Wait on={saveData}>
                    {() => {
                        const image = player.image_url || PLAYER_FALLBACK_IMAGE
                        return (
                            <div className="flex h-full items-center justify-center pb-8">
                                <img
                                    key={image}
                                    src={image}
                                    alt="placeholder"
                                    className="pixel-image m-auto h-full max-w-full rounded-lg object-contain duration-500 animate-in fade-in"
                                />
                            </div>
                        )
                    }}
                </Wait>
            </Card>
            <Card className="h-[calc(50%-1rem)] bg-transparent pt-4">
                <Wait on={saveData}>
                    {(saveData) => (
                        <div className="h-full overflow-auto px-5">
                            <h3 className="pb-3 text-zinc-500">inventory</h3>
                            <Table.Root>
                                <Table.Body className="align-middle">
                                    {saveData.heldItems.length === 0 && (
                                        <Table.Row className="text-zinc-500">
                                            &nbsp; &nbsp; no items
                                        </Table.Row>
                                    )}
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
                                                <Table.RowHeaderCell className="w-1/3">
                                                    {item.name}
                                                </Table.RowHeaderCell>
                                                <Table.Cell className="w-2/3">
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
                    )}
                </Wait>
            </Card>
        </>
    )
}
