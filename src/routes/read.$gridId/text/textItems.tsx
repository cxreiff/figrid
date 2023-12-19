import { Button } from "@itsmapleleaf/radix-themes"
import { TextTyper } from "~/components/textTyper.tsx"
import { availableItemsMap } from "~/routes/read.$gridId/commands.ts"
import type { TileWithCoords } from "~/routes/read.$gridId/processing.server.ts"
import type { SaveData } from "~/utilities/useSaveData.ts"

export function TextItems({
    saveData,
    currentTile,
    handleCommand,
}: {
    saveData: SaveData
    currentTile: TileWithCoords
    handleCommand: (command: string) => void
}) {
    const items = Object.values(availableItemsMap(currentTile, saveData))
    return items.length > 0 ? (
        <div className="pb-6">
            {items.map(({ name, id, summary }) =>
                summary ? (
                    <span key={id} className="inline-block pr-2">
                        <TextTyper className="inline-block">
                            {"you see "}
                        </TextTyper>
                        <Button
                            variant="ghost"
                            className="text-base"
                            onClick={() => handleCommand(`look ${name}`)}
                        >
                            {summary}
                        </Button>
                        .
                    </span>
                ) : null,
            )}
        </div>
    ) : null
}
