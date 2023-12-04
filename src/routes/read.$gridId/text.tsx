import { Card, ScrollArea, TextField } from "@itsmapleleaf/radix-themes"
import { ChevronRightIcon } from "@radix-ui/react-icons"
import { Form } from "@remix-run/react"
import { useRef, type Dispatch, type SetStateAction } from "react"
import { TextTyper } from "~/components/textTyper.tsx"
import type { TilesSelectModel } from "~/database/schema/grids.server.ts"
import { availableCommands } from "~/routes/read.$gridId/commands.ts"

export function Text({
    tile,
    command,
    commandLog,
    setCommand,
    handleCommand,
}: {
    tile: TilesSelectModel
    command: string
    commandLog: string[]
    setCommand: Dispatch<SetStateAction<string>>
    handleCommand: (command: string) => void
}) {
    const inputRef = useRef<HTMLInputElement>(null)
    const textRef = useRef<HTMLDivElement>(null)

    return (
        <div
            key={tile.id}
            className="flex h-full flex-col gap-5"
            onClick={() => {
                inputRef.current?.focus()
                textRef.current?.click()
            }}
        >
            <Card key={tile.id} className="h-[calc(100vh-9.4rem)]">
                <ScrollArea className="flex-1 p-5">
                    <TextTyper
                        className="pb-6"
                        textRef={textRef}
                        text={`${
                            tile.description || "[empty description]"
                        }\n\nthere are exits to the ${[
                            tile.north_id && "north",
                            tile.east_id && "east",
                            tile.south_id && "south",
                            tile.west_id && "west",
                        ]
                            .filter((dir) => dir != undefined)
                            .join(", ")}.`}
                    />
                    {commandLog.map((message, index) => (
                        <TextTyper
                            key={index}
                            text={message}
                            className={
                                "pb-6 " +
                                (index % 2 ? undefined : "text-zinc-400")
                            }
                        />
                    ))}
                </ScrollArea>
            </Card>
            <Form
                className="pb-1"
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
                        key={tile.id}
                        ref={inputRef}
                        className="outline-none"
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
