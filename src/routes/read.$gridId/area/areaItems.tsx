import { useContext } from "react"
import { availableItemsMap } from "~/routes/read.$gridId/commands.ts"
import type { loader } from "~/routes/read.$gridId/route.tsx"
import { WaitSaveData } from "~/components/waitSaveData.tsx"
import { ContextCommand } from "~/utilities/contextCommand.ts"
import { useSuperLoaderData } from "~/utilities/superjson.ts"
import {
    Table,
    TableBody,
    TableCell,
    TableRow,
} from "~/components/ui/table.tsx"
import { Button } from "~/components/ui/button.tsx"

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
                    <div className="pb-8">
                        <h3 className="text-muted-foreground">items</h3>
                        <Table>
                            <TableBody className="align-middle">
                                {items.length === 0 && (
                                    <TableRow className="text-muted">
                                        <TableCell className="shadow-none">
                                            &nbsp; &nbsp; no items
                                        </TableCell>
                                    </TableRow>
                                )}
                                {items.map((item) => (
                                    <TableRow key={item.id}>
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
                                        <TableCell>
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
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                )
            }}
        </WaitSaveData>
    )
}
