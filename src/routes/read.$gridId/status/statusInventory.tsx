import { Button, Table } from "@itsmapleleaf/radix-themes"
import { useContext } from "react"
import { WaitSaveData } from "~/components/waitSaveData.tsx"
import type { loader } from "~/routes/read.$gridId/route.tsx"
import { ContextCommand } from "~/utilities/contextCommand.ts"
import { useSuperLoaderData } from "~/utilities/superjson.ts"

export function StatusInventory() {
    const { itemIdMap, itemInstanceIdMap } = useSuperLoaderData<typeof loader>()
    const handleCommand = useContext(ContextCommand)

    return (
        <WaitSaveData>
            {(saveData) => (
                <>
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
                                        itemInstanceIdMap[instanceId].item_id
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
                </>
            )}
        </WaitSaveData>
    )
}
