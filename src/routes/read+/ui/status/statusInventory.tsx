import { Button } from "~/ui/primitives/button.tsx"
import { useContext } from "react"
import { WaitSaveData } from "~/ui/waitSaveData.tsx"
import type { loader } from "~/routes/read+/$gridId.tsx"
import { ContextCommand } from "~/lib/contextCommand.ts"
import { useSuperLoaderData } from "~/lib/superjson.ts"
import {
    Table,
    TableBody,
    TableCell,
    TableRow,
} from "~/ui/primitives/table.tsx"

export function StatusInventory() {
    const { itemIdMap, itemInstanceIdMap } = useSuperLoaderData<typeof loader>()
    const handleCommand = useContext(ContextCommand)

    return (
        <WaitSaveData>
            {(saveData) => (
                <>
                    <h3 className="text-muted-foreground">inventory</h3>
                    <Table>
                        <TableBody>
                            {saveData.heldItems.length === 0 && (
                                <TableRow className="pl-4 text-muted">
                                    <TableCell>no items</TableCell>
                                </TableRow>
                            )}
                            {saveData.heldItems.map((instanceId) => {
                                const item =
                                    itemIdMap[
                                        itemInstanceIdMap[instanceId].item_id
                                    ]
                                return (
                                    <TableRow key={item.id}>
                                        <TableCell className="w-1/3">
                                            {item.name}
                                        </TableCell>
                                        <TableCell className="w-2/3">
                                            {item.summary}
                                        </TableCell>
                                        <TableCell>
                                            <Button
                                                onClick={() =>
                                                    handleCommand(
                                                        `look ${item.name.toLowerCase()}`,
                                                    )
                                                }
                                            >
                                                look
                                            </Button>
                                        </TableCell>
                                        <TableCell>
                                            <Button
                                                onClick={() =>
                                                    handleCommand(
                                                        `use ${item.name.toLowerCase()}`,
                                                    )
                                                }
                                            >
                                                use
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                )
                            })}
                        </TableBody>
                    </Table>
                </>
            )}
        </WaitSaveData>
    )
}
