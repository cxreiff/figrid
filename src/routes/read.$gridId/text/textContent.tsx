import type { RefObject } from "react"
import { TextTyper } from "~/components/textTyper.tsx"
import type {
    IdMap,
    TileWithCoords,
} from "~/routes/read.$gridId/processing.server.ts"
import type { GridQuery } from "~/routes/read.$gridId/query.server.ts"
import { TextExits } from "~/routes/read.$gridId/text/textExits.tsx"
import { TextCharacters } from "~/routes/read.$gridId/text/textCharacters.tsx"
import { TextLog } from "~/routes/read.$gridId/text/textLog.tsx"
import { TextOptions } from "~/routes/read.$gridId/text/textOptions.tsx"
import type { SaveData } from "~/utilities/useSaveData.ts"
import { TextItems } from "~/routes/read.$gridId/text/textItems.tsx"

export function TextContent({
    saveData,
    tileIdMap,
    itemIdMap,
    itemInstanceIdMap,
    eventIdMap,
    commandLog,
    textRef,
    handleCommand,
}: {
    saveData: SaveData
    tileIdMap: IdMap<TileWithCoords>
    itemIdMap: IdMap<GridQuery["items"][0]>
    itemInstanceIdMap: IdMap<GridQuery["item_instances"][0]>
    eventIdMap: IdMap<GridQuery["events"][0]>
    commandLog: string[]
    textRef: RefObject<HTMLDivElement>
    handleCommand: (command: string) => void
}) {
    const currentTile = tileIdMap[saveData.currentTileId]

    const currentEvent =
        saveData.currentEventId !== undefined
            ? eventIdMap[saveData.currentEventId]
            : undefined

    return (
        <>
            <TextTyper className="pb-6 italic text-[var(--accent-8)]">
                {currentEvent?.summary || currentTile.name}
            </TextTyper>
            <TextTyper className="pb-6" textRef={textRef}>
                {(saveData.currentEventId
                    ? eventIdMap[saveData.currentEventId].description
                    : currentTile.description) || "[empty description]"}
            </TextTyper>
            {!currentEvent ? (
                <>
                    <TextCharacters
                        currentTile={currentTile}
                        handleCommand={handleCommand}
                    />
                    <TextItems
                        saveData={saveData}
                        currentTile={currentTile}
                        handleCommand={handleCommand}
                    />
                </>
            ) : null}
            {currentEvent ? (
                <TextOptions
                    saveData={saveData}
                    currentEvent={currentEvent}
                    itemIdMap={itemIdMap}
                    itemInstanceIdMap={itemInstanceIdMap}
                    handleCommand={handleCommand}
                />
            ) : (
                <TextExits
                    saveData={saveData}
                    currentTile={currentTile}
                    handleCommand={handleCommand}
                />
            )}
            <TextLog commandLog={commandLog} />
        </>
    )
}
