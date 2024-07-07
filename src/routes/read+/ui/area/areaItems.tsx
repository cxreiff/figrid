import { useContext } from "react"
import { availableItemsMap } from "~/routes/read+/lib/commands.ts"
import type { loader } from "~/routes/read+/$gridId.tsx"
import { WaitSaveData } from "~/ui/waitSaveData.tsx"
import { ContextCommand } from "~/lib/contextCommand.ts"
import { useSuperLoaderData } from "~/lib/superjson.ts"
import {
    Table,
    TableBody,
    TableCell,
    TableRow,
} from "~/ui/primitives/table.tsx"
import { Button } from "~/ui/primitives/button.tsx"
import { ContextTabs } from "~/lib/contextTabs.ts"

export function AreaItems() {
    const { tileIdMap } = useSuperLoaderData<typeof loader>()
    const handleCommand = useContext(ContextCommand)
    const { setReadTab } = useContext(ContextTabs)

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
                                        <TableCell className="pl-4 shadow-none">
                                            no items
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
                                                onClick={() => {
                                                    setReadTab("prompt")
                                                    handleCommand(
                                                        `look ${item.name.toLowerCase()}`,
                                                    )
                                                }}
                                            >
                                                look
                                            </Button>
                                        </TableCell>
                                        <TableCell>
                                            <Button
                                                onClick={() => {
                                                    setReadTab("prompt")
                                                    handleCommand(
                                                        `take ${item.name.toLowerCase()}`,
                                                    )
                                                }}
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
