import { Button } from "~/components/ui/button.tsx"
import { useContext } from "react"
import { WaitSaveData } from "~/components/waitSaveData.tsx"
import type { loader } from "~/routes/read.$gridId/route.tsx"
import { ContextCommand } from "~/utilities/contextCommand.ts"
import { useSuperLoaderData } from "~/utilities/superjson.ts"
import {
    Table,
    TableBody,
    TableCell,
    TableRow,
} from "~/components/ui/table.tsx"

export function StatusInventory() {
    const { itemIdMap, itemInstanceIdMap } = useSuperLoaderData<typeof loader>()
    const handleCommand = useContext(ContextCommand)

    return (
        <WaitSaveData>
            {(saveData) => (
                <>
                    <h3 className="pb-3 text-muted-foreground">inventory</h3>
                    <Table>
                        <TableBody>
                            {saveData.heldItems.length === 0 && (
                                <TableRow className="text-muted">
                                    <TableCell>
                                        &nbsp; &nbsp; no items
                                    </TableCell>
                                </TableRow>
                            )}
                            {saveData.heldItems.map((instanceId) => {
                                const item =
                                    itemIdMap[
                                        itemInstanceIdMap[instanceId].item_id
                                    ]
                                return (
                                    <TableRow
                                        key={item.id}
                                        className="duration-500 animate-in fade-in"
                                    >
                                        <TableCell className="w-1/3">
                                            {item.name}
                                        </TableCell>
                                        <TableCell className="w-2/3">
                                            {item.summary}
                                        </TableCell>
                                        <TableCell>
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
