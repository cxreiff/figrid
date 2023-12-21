import { useContext, type RefObject } from "react"
import { TextTyper } from "~/components/textTyper.tsx"
import { TextExits } from "~/routes/read.$gridId/text/textExits.tsx"
import { TextCharacters } from "~/routes/read.$gridId/text/textCharacters.tsx"
import { TextLog } from "~/routes/read.$gridId/text/textLog.tsx"
import { TextOptions } from "~/routes/read.$gridId/text/textOptions.tsx"
import { TextItems } from "~/routes/read.$gridId/text/textItems.tsx"
import { WaitSaveData } from "~/components/waitSaveData.tsx"
import { useSuperLoaderData } from "~/utilities/superjson.ts"
import type { loader } from "~/routes/read.$gridId/route.tsx"
import { ContextCommand } from "~/utilities/contextCommand.ts"

export function TextContent({
    commandLog,
    textRef,
}: {
    commandLog: string[]
    textRef: RefObject<HTMLDivElement>
}) {
    const { tileIdMap, eventIdMap, itemIdMap, itemInstanceIdMap } =
        useSuperLoaderData<typeof loader>()
    const handleCommand = useContext(ContextCommand)

    return (
        <WaitSaveData>
            {(saveData) => {
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
                                ? eventIdMap[saveData.currentEventId]
                                      .description
                                : currentTile.description) ||
                                "[empty description]"}
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
            }}
        </WaitSaveData>
    )
}
