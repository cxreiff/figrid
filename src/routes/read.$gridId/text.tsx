import { Button, TextField } from "@itsmapleleaf/radix-themes"
import { ChevronRightIcon } from "@radix-ui/react-icons"
import { Form } from "@remix-run/react"
import { useRef, type Dispatch, type SetStateAction, useEffect } from "react"
import { Card } from "~/components/card.tsx"
import { TextTyper } from "~/components/textTyper.tsx"
import { Wait } from "~/components/wait.tsx"
import { availableCommands } from "~/routes/read.$gridId/commands.ts"
import type {
    IdMap,
    TileWithCoords,
} from "~/routes/read.$gridId/processing.server.ts"
import type { GridQuery } from "~/routes/read.$gridId/query.server.ts"
import { commasWithConjunction } from "~/utilities/misc.ts"
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
                        {(saveData) => {
                            const currentTile =
                                tileIdMap[saveData.currentTileId]

                            const currentEvent =
                                saveData.currentEventId !== undefined
                                    ? eventIdMap[saveData.currentEventId]
                                    : undefined

                            const exits = currentTile.gates.map(
                                ({ type }) => type,
                            )
                            const exitsMessage = commasWithConjunction(
                                exits,
                                "and",
                            )

                            return (
                                <>
                                    {currentTile.name && (
                                        <TextTyper className="pb-6 italic text-[var(--accent-8)]">
                                            {currentTile.name}
                                        </TextTyper>
                                    )}
                                    <TextTyper
                                        className="pb-6"
                                        textRef={textRef}
                                    >
                                        {(saveData.currentEventId
                                            ? eventIdMap[
                                                  saveData.currentEventId
                                              ].description
                                            : currentTile.description) ||
                                            "[empty description]"}
                                    </TextTyper>
                                    {commandLog.map((message, index) => (
                                        <TextTyper
                                            key={index}
                                            className={
                                                "pb-6 " +
                                                (index % 2
                                                    ? undefined
                                                    : "text-zinc-500")
                                            }
                                        >
                                            {message}
                                        </TextTyper>
                                    ))}
                                    {currentEvent ? (
                                        currentEvent.child_events.length > 0 ? (
                                            currentEvent.child_events.map(
                                                ({ trigger, ...event }) => {
                                                    if (trigger === null) {
                                                        return null
                                                    }

                                                    const requiredItem =
                                                        event.must_have_item_id
                                                            ? saveData.heldItems
                                                                  .map(
                                                                      (
                                                                          instance_id,
                                                                      ) =>
                                                                          itemInstanceIdMap[
                                                                              instance_id
                                                                          ]
                                                                              .item,
                                                                  )
                                                                  .find(
                                                                      (item) =>
                                                                          item.id ===
                                                                          event.must_have_item_id,
                                                                  )
                                                            : undefined

                                                    const itemMissing =
                                                        event.must_have_item_id &&
                                                        !requiredItem
                                                            ? ` (missing ${
                                                                  itemIdMap[
                                                                      event
                                                                          .must_have_item_id
                                                                  ].name
                                                              })`
                                                            : undefined

                                                    const itemTrade =
                                                        event.must_have_item_id &&
                                                        requiredItem
                                                            ? ` (use ${requiredItem.name})`
                                                            : undefined

                                                    return (
                                                        <Button
                                                            key={event.id}
                                                            variant="ghost"
                                                            className="mx-2 mb-3"
                                                            onClick={() =>
                                                                handleCommand(
                                                                    trigger,
                                                                )
                                                            }
                                                            disabled={
                                                                !!itemMissing
                                                            }
                                                        >
                                                            {trigger}
                                                            {itemMissing}
                                                            {itemTrade}
                                                        </Button>
                                                    )
                                                },
                                            )
                                        ) : (
                                            <TextTyper className="pb-6 text-[var(--accent-11)]">
                                                [press ENTER to continue]
                                            </TextTyper>
                                        )
                                    ) : (
                                        <TextTyper className="pb-6 text-[var(--accent-11)]">
                                            {`there are exits to the ${exitsMessage}.`}
                                        </TextTyper>
                                    )}
                                </>
                            )
                        }}
                    </Wait>
                </div>
            </Card>
            <Form
                className="h-12 border-zinc-700 pb-1"
                onSubmit={(event) => {
                    event.preventDefault()
                    handleCommand(command)
                }}
            >
                <TextField.Root>
                    <TextField.Slot>
                        <ChevronRightIcon />
                    </TextField.Slot>
                    <TextField.Input
                        ref={inputRef}
                        className="h-12 outline-none"
                        value={command}
                        onChange={(event) =>
                            setCommand(event.target.value.toLowerCase())
                        }
                        onKeyDown={() => !command && textRef.current?.click()}
                        autoFocus
                    />
                    <TextField.Input type="submit" hidden />
                    <TextField.Slot className="pr-3 text-zinc-500">
                        {availableCommands(command).join(", ")}
                    </TextField.Slot>
                </TextField.Root>
            </Form>
        </div>
    )
}
