import { Button, Table } from "@itsmapleleaf/radix-themes"
import { useContext } from "react"
import type { loader } from "~/routes/read.$gridId/route.tsx"
import { WaitSaveData } from "~/components/waitSaveData.tsx"
import { ContextCommand } from "~/utilities/contextCommand.ts"
import { useSuperLoaderData } from "~/utilities/superjson.ts"

export function AreaCharacters() {
    const { tileIdMap } = useSuperLoaderData<typeof loader>()
    const handleCommand = useContext(ContextCommand)

    return (
        <WaitSaveData>
            {(saveData) => {
                const currentTile = tileIdMap[saveData.currentTileId]
                return (
                    <>
                        <h3 className="pb-3 text-zinc-500">characters</h3>
                        <Table.Root className="pb-8">
                            <Table.Body className="align-middle">
                                {currentTile.character_instances.length ===
                                    0 && (
                                    <Table.Row className="text-zinc-500">
                                        <Table.Cell className="shadow-none">
                                            &nbsp; &nbsp; no characters
                                        </Table.Cell>
                                    </Table.Row>
                                )}
                                {currentTile.character_instances.map(
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
                    </>
                )
            }}
        </WaitSaveData>
    )
}
