import { TextField } from "@itsmapleleaf/radix-themes"
import { ChevronRightIcon } from "@radix-ui/react-icons"
import { Form } from "@remix-run/react"
import { useRef, type Dispatch, type SetStateAction, useEffect } from "react"
import { Card } from "~/components/card.tsx"
import { TextTyper } from "~/components/textTyper.tsx"
import { Wait } from "~/components/wait.tsx"
import { availableCommands } from "~/routes/read.$gridId/commands.ts"
import type { IdMap, TileWithCoords } from "~/routes/read.$gridId/processing.ts"
import { commasWithAnd } from "~/utilities/misc.ts"
import type { SaveData } from "~/utilities/useSaveData.ts"

export function Text({
    saveData,
    tileIdMap,
    command,
    commandLog,
    setCommand,
    handleCommand,
}: {
    saveData?: SaveData
    tileIdMap: IdMap<TileWithCoords>
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

                            const exitsMessage = commasWithAnd(
                                currentTile.gates.map(({ type }) => type),
                            )

                            return (
                                <>
                                    {currentTile.name && (
                                        <TextTyper
                                            className="pb-6 italic text-[var(--accent-8)]"
                                            text={`[${currentTile.name}]`}
                                        />
                                    )}
                                    <TextTyper
                                        className="pb-6"
                                        textRef={textRef}
                                        text={`${
                                            currentTile.description ||
                                            "[empty description]"
                                        }\n\nthere are exits to the ${exitsMessage}.`}
                                    />
                                    {commandLog.map((message, index) => (
                                        <TextTyper
                                            key={index}
                                            text={message}
                                            className={
                                                "pb-6 " +
                                                (index % 2
                                                    ? undefined
                                                    : "text-zinc-500")
                                            }
                                        />
                                    ))}
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
