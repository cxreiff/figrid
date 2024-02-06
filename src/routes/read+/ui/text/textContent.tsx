import { useContext, type RefObject } from "react"
import { TextTyper } from "~/ui/textTyper.tsx"
import { TextExits } from "~/routes/read+/ui/text/textExits.tsx"
import { TextCharacters } from "~/routes/read+/ui/text/textCharacters.tsx"
import { TextLog } from "~/routes/read+/ui/text/textLog.tsx"
import { TextOptions } from "~/routes/read+/ui/text/textOptions.tsx"
import { TextItems } from "~/routes/read+/ui/text/textItems.tsx"
import { WaitSaveData } from "~/ui/waitSaveData.tsx"
import { useSuperLoaderData } from "~/lib/superjson.ts"
import type { loader } from "~/routes/read+/$gridId.tsx"
import { ContextCommand } from "~/lib/contextCommand.ts"

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
                        <TextTyper className="pb-6 italic text-accent">
                            {currentEvent?.summary || currentTile.name}
                        </TextTyper>
                        <TextTyper
                            id={"text-description"}
                            className="pb-6"
                            textRef={textRef}
                        >
                            {(saveData.currentEventId
                                ? eventIdMap[saveData.currentEventId]
                                      .description
                                : currentTile.description) || ""}
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
                                eventIdMap={eventIdMap}
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
