import {
    Table,
    TableBody,
    TableCell,
    TableRow,
} from "~/ui/primitives/table.tsx"
import { useContext } from "react"
import type { loader } from "~/routes/read+/+$gridId.tsx"
import { WaitSaveData } from "~/ui/waitSaveData.tsx"
import { ContextCommand } from "~/lib/contextCommand.ts"
import { useSuperLoaderData } from "~/lib/superjson.ts"
import { Button } from "~/ui/primitives/button.tsx"

export function AreaCharacters() {
    const { tileIdMap } = useSuperLoaderData<typeof loader>()
    const handleCommand = useContext(ContextCommand)

    return (
        <WaitSaveData>
            {(saveData) => {
                const currentTile = tileIdMap[saveData.currentTileId]
                return (
                    <div className="pb-8">
                        <h3 className="text-muted-foreground">characters</h3>
                        <Table className="pb-12">
                            <TableBody className="align-middle">
                                {currentTile.character_instances.length ===
                                    0 && (
                                    <TableRow className="text-muted">
                                        <TableCell className="shadow-none">
                                            &nbsp; &nbsp; no characters
                                        </TableCell>
                                    </TableRow>
                                )}
                                {currentTile.character_instances.map(
                                    ({ character }) => (
                                        <TableRow key={character.id}>
                                            <TableCell className="w-1/3">
                                                {character.name}
                                            </TableCell>
                                            <TableCell className="w-2/3">
                                                {character.summary}
                                            </TableCell>
                                            <TableCell>
                                                <Button
                                                    onClick={() =>
                                                        handleCommand(
                                                            `look ${character.name.toLowerCase()}`,
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
                                                            `talk ${character.name.toLowerCase()}`,
                                                        )
                                                    }
                                                >
                                                    talk
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ),
                                )}
                            </TableBody>
                        </Table>
                    </div>
                )
            }}
        </WaitSaveData>
    )
}
