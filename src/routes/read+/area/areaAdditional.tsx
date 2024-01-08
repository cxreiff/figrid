import { useContext } from "react"
import type { loader } from "~/routes/read+/+$gridId.tsx"
import { WaitSaveData } from "~/components/waitSaveData.tsx"
import { ContextCommand } from "~/lib/contextCommand.ts"
import { useSuperLoaderData } from "~/lib/superjson.ts"
import {
    Table,
    TableBody,
    TableCell,
    TableRow,
} from "~/components/ui/table.tsx"
import { Button } from "~/components/ui/button.tsx"

export function AreaAdditional() {
    const { tileIdMap } = useSuperLoaderData<typeof loader>()
    const handleCommand = useContext(ContextCommand)

    return (
        <WaitSaveData>
            {(saveData) => {
                const currentTile = tileIdMap[saveData.currentTileId]
                return (
                    <div className="pb-8">
                        <h3 className="text-muted-foreground">additional</h3>
                        <Table>
                            <TableBody className="align-middle">
                                {currentTile.events.length === 0 && (
                                    <TableRow className="text-muted">
                                        <TableCell className="shadow-none">
                                            &nbsp; &nbsp; no other actions
                                        </TableCell>
                                    </TableRow>
                                )}
                                {currentTile.events.length > 0 && (
                                    <TableRow>
                                        <TableCell className="w-full">
                                            you can the explore the area
                                        </TableCell>
                                        <TableCell>
                                            <Button
                                                variant="ghost"
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
