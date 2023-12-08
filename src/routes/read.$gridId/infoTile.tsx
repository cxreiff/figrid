import { Button, Table, Tabs } from "@itsmapleleaf/radix-themes"
import { Wait } from "~/components/wait.tsx"
import { availableItemsMap } from "~/routes/read.$gridId/commands.ts"
import type { IdMap, TileWithCoords } from "~/routes/read.$gridId/processing.ts"
import type { SaveData } from "~/utilities/useSaveData.ts"

const TILE_FALLBACK_IMAGE = "https://img.figrid.io/tiles/kitty.png"

export function InfoTile({
    saveData,
    tileIdMap,
    handleCommand,
}: {
    saveData?: SaveData
    tileIdMap: IdMap<TileWithCoords>
    handleCommand: (command: string) => void
}) {
    return (
        <Wait on={saveData}>
            {(saveData) => {
                const tile = tileIdMap[saveData.currentTileId]
                const image = tile.image_url || TILE_FALLBACK_IMAGE
                return (
                    <>
                        <div className="flex h-3/5 items-center justify-center pb-12">
                            <img
                                key={image}
                                src={image}
                                alt="placeholder"
                                className="pixel-image m-auto h-full max-w-full rounded-lg object-contain duration-500 animate-in fade-in"
                            />
                        </div>
                        <div className="h-2/5 overflow-auto px-5">
                            <h3 className="pb-3 text-zinc-500">items</h3>
                            <Table.Root className="pb-12">
                                <Table.Body className="align-middle">
                                    {Object.values(
                                        availableItemsMap(tile, saveData),
                                    ).map((item) => (
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
                                            <Table.Cell>
                                                <Button
                                                    variant="ghost"
                                                    className="cursor-pointer"
                                                    onClick={() =>
                                                        handleCommand(
                                                            `take ${item.name.toLowerCase()}`,
                                                        )
                                                    }
                                                >
                                                    take
                                                </Button>
                                            </Table.Cell>
                                        </Table.Row>
                                    ))}
                                </Table.Body>
                            </Table.Root>
                            <h3 className="pb-3 text-zinc-500">characters</h3>
                            <Table.Root>
                                <Table.Body className="align-middle">
                                    {tile.character_instances.map(
                                        ({ character }) => (
                                            <Table.Row key={character.id}>
                                                <Table.RowHeaderCell className="w-1/3">
                                                    {character.name}
                                                </Table.RowHeaderCell>
                                                <Table.Cell className="w-2/3">
                                                    {character.summary}
                                                </Table.Cell>
                                                <Table.Cell>
                                                    <Button
                                                        variant="ghost"
                                                        className="cursor-pointer"
                                                        onClick={() =>
                                                            handleCommand(
                                                                `look ${character.name.toLowerCase()}`,
                                                            )
                                                        }
                                                    >
                                                        look
                                                    </Button>
                                                </Table.Cell>
                                                <Table.Cell>
                                                    <Button
                                                        variant="ghost"
                                                        className="cursor-pointer"
                                                        onClick={() =>
                                                            handleCommand(
                                                                `talk ${character.name.toLowerCase()}`,
                                                            )
                                                        }
                                                    >
                                                        talk
                                                    </Button>
                                                </Table.Cell>
                                            </Table.Row>
                                        ),
                                    )}
                                </Table.Body>
                            </Table.Root>
                        </div>
                    </>
                )
            }}
        </Wait>
    )
}
