import { Button, Table, Tabs } from "@itsmapleleaf/radix-themes"

import { Card } from "~/components/card.tsx"
import { Wait } from "~/components/wait.tsx"
import { availableItems } from "~/routes/read.$gridId/commands.ts"
import type { TileIdMap } from "~/routes/read.$gridId/processing.ts"
import type { SaveData } from "~/utilities/useSaveData.ts"

const TILE_FALLBACK_IMAGE = "https://img.figrid.io/tiles/kitty.png"

export function Info({
    saveData,
    tileIdMap,
    handleCommand,
}: {
    saveData?: SaveData
    tileIdMap: TileIdMap
    handleCommand: (command: string) => void
}) {
    return (
        <Card className="h-full bg-transparent">
            <Tabs.Root defaultValue="tile" className="h-full">
                <Tabs.Content value="tile" className="h-[calc(100%-3rem)] p-4">
                    <Wait on={saveData}>
                        {(saveData) => {
                            const tile = tileIdMap[saveData.currentTileId]
                            const image = tile.image_url || TILE_FALLBACK_IMAGE
                            return (
                                <>
                                    <div className="flex h-3/5 items-center justify-center pb-8">
                                        <img
                                            key={image}
                                            src={image}
                                            alt="placeholder"
                                            className="pixel-image m-auto max-h-full max-w-full rounded-lg object-contain duration-500 animate-in fade-in"
                                        />
                                    </div>
                                    <div className="h-2/5 overflow-auto p-5">
                                        <Table.Root className="pb-8">
                                            <Table.Body className="text-center align-middle">
                                                {availableItems(
                                                    tile,
                                                    saveData,
                                                ).map((item) => (
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
                                                                        `take ${item.name}`,
                                                                    )
                                                                }
                                                            >
                                                                take
                                                            </Button>
                                                        </Table.Cell>
                                                        <Table.Cell>
                                                            <Button
                                                                variant="ghost"
                                                                className="cursor-pointer"
                                                                onClick={() =>
                                                                    handleCommand(
                                                                        `look ${item.name}`,
                                                                    )
                                                                }
                                                            >
                                                                look
                                                            </Button>
                                                        </Table.Cell>
                                                    </Table.Row>
                                                ))}
                                            </Table.Body>
                                        </Table.Root>
                                        <Table.Root>
                                            <Table.Body>
                                                <Table.Row>
                                                    <Table.RowHeaderCell>
                                                        placeholder item 1
                                                    </Table.RowHeaderCell>
                                                    <Table.Cell>
                                                        a placeholder item
                                                    </Table.Cell>
                                                    <Table.Cell>2g</Table.Cell>
                                                </Table.Row>

                                                <Table.Row>
                                                    <Table.RowHeaderCell>
                                                        placeholder item 2
                                                    </Table.RowHeaderCell>
                                                    <Table.Cell>
                                                        another placeholder item
                                                    </Table.Cell>
                                                    <Table.Cell>3g</Table.Cell>
                                                </Table.Row>

                                                <Table.Row>
                                                    <Table.RowHeaderCell>
                                                        placeholder item 3
                                                    </Table.RowHeaderCell>
                                                    <Table.Cell>
                                                        a third placeholder item
                                                    </Table.Cell>
                                                    <Table.Cell>4g</Table.Cell>
                                                </Table.Row>
                                            </Table.Body>
                                        </Table.Root>
                                    </div>
                                </>
                            )
                        }}
                    </Wait>
                </Tabs.Content>

                <Tabs.Content value="status" className="h-[calc(100%-3rem)]">
                    Empty
                </Tabs.Content>

                <Tabs.Content value="data" className="h-[calc(100%-3rem)]">
                    Empty
                </Tabs.Content>
                <Tabs.List className="absolute bottom-0 mx-4 mt-6 h-10 shadow-none">
                    <Tabs.Trigger value="tile" className="cursor-pointer">
                        tile
                    </Tabs.Trigger>
                    <Tabs.Trigger value="status" className="cursor-pointer">
                        status
                    </Tabs.Trigger>
                    <Tabs.Trigger value="data" className="cursor-pointer">
                        data
                    </Tabs.Trigger>
                </Tabs.List>
            </Tabs.Root>
        </Card>
    )
}
