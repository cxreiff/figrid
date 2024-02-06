import { useContext } from "react"
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

export function AreaAdditional() {
    const { tileIdMap } = useSuperLoaderData<typeof loader>()
    const handleCommand = useContext(ContextCommand)

    return (
        <WaitSaveData>
            {(saveData) => {
                const currentTile = tileIdMap[saveData.currentTileId]
                return (
                    <div>
                        <h3 className="text-muted-foreground">additional</h3>
                        <Table>
                            <TableBody className="align-middle">
                                {currentTile.event_instances.length === 0 && (
                                    <TableRow className="text-muted">
                                        <TableCell className="shadow-none">
                                            &nbsp; &nbsp; no other actions
                                        </TableCell>
                                    </TableRow>
                                )}
                                {currentTile.event_instances.length > 0 && (
                                    <TableRow>
                                        <TableCell className="w-full">
                                            you can the explore the area
                                        </TableCell>
                                        <TableCell>
                                            <Button
                                                onClick={() =>
                                                    handleCommand("explore")
                                                }
                                            >
                                                explore
                                            </Button>{" "}
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                )
            }}
        </WaitSaveData>
    )
}
