import { Button, Table } from "@itsmapleleaf/radix-themes"
import { useContext } from "react"
import { availableItemsMap } from "~/routes/read.$gridId/commands.ts"
import type { loader } from "~/routes/read.$gridId/route.tsx"
import { WaitSaveData } from "~/components/waitSaveData.tsx"
import { ContextCommand } from "~/utilities/contextCommand.ts"
import { useSuperLoaderData } from "~/utilities/superjson.ts"

export function AreaItems() {
    const { tileIdMap } = useSuperLoaderData<typeof loader>()
    const handleCommand = useContext(ContextCommand)

    return (
        <WaitSaveData>
            {(saveData) => {
                const items = Object.values(
                    availableItemsMap(
                        tileIdMap[saveData.currentTileId],
                        saveData,
                    ),
                )
                return (
                    <>
                        <h3 className="pb-3 text-zinc-500">items</h3>
                        <Table.Root className="pb-8">
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
                    </>
                )
            }}
        </WaitSaveData>
    )
}
