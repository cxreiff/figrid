import { Button, Table } from "@itsmapleleaf/radix-themes"
import { Card } from "~/components/card.tsx"
import { Image } from "~/components/image.tsx"
import { Wait } from "~/components/wait.tsx"
import { availableItemsMap } from "~/routes/read.$gridId/commands.ts"
import type {
    IdMap,
    TileWithCoords,
} from "~/routes/read.$gridId/processing.server.ts"
import type { SaveData } from "~/utilities/useSaveData.ts"

export const TILE_FALLBACK_IMAGE = "https://img.figrid.io/tiles/kitty.png"

export function Area({
    saveData,
    tileIdMap,
    handleCommand,
}: {
    saveData?: SaveData
    tileIdMap: IdMap<TileWithCoords>
    handleCommand: (command: string) => void
}) {
    return (
        <>
            <Card className="mb-4 h-1/2 bg-zinc-950">
                <Wait on={saveData}>
                    {(saveData) => {
                        const tile = tileIdMap[saveData.currentTileId]
                        const image = tile.image_url || TILE_FALLBACK_IMAGE
                        return (
                            <div className="flex h-full items-center justify-center">
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
                    {(saveData) => {
                        const tile = tileIdMap[saveData.currentTileId]
                        const items = Object.values(
                            availableItemsMap(tile, saveData),
                        )
                        return (
                            <div className="h-full overflow-auto px-5">
                                <h3 className="pb-3 text-zinc-500">items</h3>
                                <Table.Root className="pb-12">
                                    <Table.Body className="align-middle">
                                        {items.length === 0 && (
                                            <Table.Row className="text-zinc-500">
                                                <Table.Cell className="shadow-none">
                                                    &nbsp; &nbsp; no items
                                                </Table.Cell>
                                            </Table.Row>
                                        )}
                                        {items.map((item) => (
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
                                                <Table.Cell>
                                                    <Button
                                                        variant="ghost"
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
                                <h3 className="pb-3 text-zinc-500">
                                    characters
                                </h3>
                                <Table.Root>
                                    <Table.Body className="align-middle">
                                        {tile.character_instances.length ===
                                            0 && (
                                            <Table.Row className="text-zinc-500">
                                                <Table.Cell className="shadow-none">
                                                    &nbsp; &nbsp; no characters
                                                </Table.Cell>
                                            </Table.Row>
                                        )}
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
                        )
                    }}
                </Wait>
            </Card>
        </>
    )
}