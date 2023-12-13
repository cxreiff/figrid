import { Button, Table } from "@itsmapleleaf/radix-themes"
import { Card } from "~/components/card.tsx"
import { Image } from "~/components/image.tsx"
import { Wait } from "~/components/wait.tsx"
import type { IdMap } from "~/routes/read.$gridId/processing.server.ts"
import type { GridQuery } from "~/routes/read.$gridId/query.server.ts"
import type { SaveData } from "~/utilities/useSaveData.ts"

const PLAYER_FALLBACK_IMAGE = "https://img.figrid.io/tiles/kitty.png"

export function Status({
    saveData,
    player,
    itemIdMap,
    itemInstanceIdMap,
    handleCommand,
}: {
    saveData?: SaveData
    player: GridQuery["player"]
    itemIdMap: IdMap<GridQuery["items"][0]>
    itemInstanceIdMap: IdMap<GridQuery["item_instances"][0]>
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
                                <Image
                                    key={image}
                                    src={image}
                                    alt="placeholder"
                                />
                            </div>
                        )
                    }}
                </Wait>
            </Card>
            <Card className="h-[calc(50%-1rem)] pt-4">
                <Wait on={saveData}>
                    {(saveData) => (
                        <div className="h-full overflow-auto px-5">
                            <h3 className="pb-3 text-zinc-500">inventory</h3>
                            <Table.Root>
                                <Table.Body className="align-middle">
                                    {saveData.heldItems.length === 0 && (
                                        <Table.Row className="text-zinc-500">
                                            <Table.Cell className="shadow-none">
                                                &nbsp; &nbsp; no items
                                            </Table.Cell>
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
