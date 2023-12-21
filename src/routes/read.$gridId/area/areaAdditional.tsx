import { Button, Table } from "@itsmapleleaf/radix-themes"
import { useContext } from "react"
import type { loader } from "~/routes/read.$gridId/route.tsx"
import { WaitSaveData } from "~/components/waitSaveData.tsx"
import { ContextCommand } from "~/utilities/contextCommand.ts"
import { useSuperLoaderData } from "~/utilities/superjson.ts"

export function AreaAdditional() {
    const { tileIdMap } = useSuperLoaderData<typeof loader>()
    const handleCommand = useContext(ContextCommand)

    return (
        <WaitSaveData>
            {(saveData) => {
                const currentTile = tileIdMap[saveData.currentTileId]
                return (
                    <>
                        <h3 className="pb-3 text-zinc-500">additional</h3>
                        <Table.Root>
                            <Table.Body className="align-middle">
                                {currentTile.events.length === 0 && (
                                    <Table.Row className="text-zinc-500">
                                        <Table.RowHeaderCell className="shadow-none">
                                            &nbsp; &nbsp; no other actions
                                        </Table.RowHeaderCell>
                                    </Table.Row>
                                )}
                                {currentTile.events.length > 0 && (
                                    <Table.Row>
                                        <Table.RowHeaderCell className="w-full">
                                            you can the explore the area
                                        </Table.RowHeaderCell>
                                        <Table.Cell>
                                            <Button
                                                variant="ghost"
                                                onClick={() =>
                                                    handleCommand("explore")
                                                }
                                            >
                                                explore
                                            </Button>{" "}
                                        </Table.Cell>
                                    </Table.Row>
                                )}
                            </Table.Body>
                        </Table.Root>
                    </>
                )
            }}
        </WaitSaveData>
    )
}
