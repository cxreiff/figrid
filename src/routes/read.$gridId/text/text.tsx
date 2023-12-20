import { Card } from "@itsmapleleaf/radix-themes"
import { useRef, type Dispatch, type SetStateAction, useEffect } from "react"
import { Wait } from "~/components/wait.tsx"
import type {
    IdMap,
    TileWithCoords,
} from "~/routes/read.$gridId/processing.server.ts"
import type { GridQuery } from "~/routes/read.$gridId/query.server.ts"
import { TextContent } from "~/routes/read.$gridId/text/textContent.tsx"
import { TextPrompt } from "~/routes/read.$gridId/text/textPrompt.tsx"
import type { SaveData } from "~/utilities/useSaveData.ts"

export function Text({
    saveData,
    tileIdMap,
    itemIdMap,
    itemInstanceIdMap,
    eventIdMap,
    command,
    commandLog,
    setCommand,
    handleCommand,
}: {
    saveData?: SaveData
    tileIdMap: IdMap<TileWithCoords>
    itemIdMap: IdMap<GridQuery["items"][0]>
    itemInstanceIdMap: IdMap<GridQuery["item_instances"][0]>
    eventIdMap: IdMap<GridQuery["events"][0]>
    command: string
    commandLog: string[]
    setCommand: Dispatch<SetStateAction<string>>
    handleCommand: (command: string) => void
}) {
    const inputRef = useRef<HTMLInputElement>(null)
    const textRef = useRef<HTMLDivElement>(null)

    useEffect(() => inputRef?.current?.focus(), [saveData?.currentTileId])

    return (
        <div
            className="flex h-full flex-col gap-4"
            onClick={() => {
                inputRef.current?.focus()
                textRef.current?.click()
            }}
        >
            <Card className="h-[calc(100%-4rem)]">
                <div className="h-full flex-1 overflow-auto p-5">
                    <Wait on={saveData}>
                        {(saveData) => (
                            <TextContent
                                saveData={saveData}
                                tileIdMap={tileIdMap}
                                itemIdMap={itemIdMap}
                                itemInstanceIdMap={itemInstanceIdMap}
                                eventIdMap={eventIdMap}
                                commandLog={commandLog}
                                textRef={textRef}
                                handleCommand={handleCommand}
                            />
                        )}
                    </Wait>
                </div>
            </Card>
            <TextPrompt
                saveData={saveData}
                command={command}
                inputRef={inputRef}
                textRef={textRef}
                tileIdMap={tileIdMap}
                eventIdMap={eventIdMap}
                itemInstanceIdMap={itemInstanceIdMap}
                setCommand={setCommand}
                handleCommand={handleCommand}
            />
        </div>
    )
}
