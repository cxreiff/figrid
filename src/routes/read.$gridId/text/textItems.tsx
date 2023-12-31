import { TextTyper } from "~/components/textTyper.tsx"
import { Button } from "~/components/ui/button.tsx"
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
                        {`you see ${summary}`
                            .split(name)
                            .flatMap((text, index) => [
                                <TextTyper
                                    key={`text.${index}`}
                                    className="inline-block"
                                >
                                    {text}
                                </TextTyper>,
                                <Button
                                    key={`button.${index}`}
                                    variant="inline"
                                    className="text-base"
                                    onClick={() =>
                                        handleCommand(`look ${name}`)
                                    }
                                >
                                    <TextTyper className="inline-block">
                                        {name}
                                    </TextTyper>
                                </Button>,
                            ])
                            .slice(0, -1)}
                        .
                    </span>
                ) : null,
            )}
        </div>
    ) : null
}
