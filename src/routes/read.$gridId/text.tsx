import { Card, Flex, TextField } from "@itsmapleleaf/radix-themes"
import { ChevronRightIcon } from "@radix-ui/react-icons"
import { Form } from "@remix-run/react"
import { useRef, useState } from "react"
import { TextTyper } from "~/components/textTyper.tsx"
import type { TilesSelectModel } from "~/database/schema/grids.server.ts"

export function Text({
    tile,
    handleCommand,
}: {
    tile: TilesSelectModel
    handleCommand: (command: string) => string
}) {
    const inputRef = useRef<HTMLInputElement>(null)
    const scrollRef = useRef<HTMLDivElement>(null)
    const [command, setCommand] = useState("")

    return (
        <Flex
            key={tile.id}
            direction="column"
            gap="5"
            onClick={() => inputRef.current?.focus()}
        >
            <Card
                key={tile.id}
                className="p-0"
                style={{ height: "calc(100vh - 10rem)" }}
            >
                <TextTyper
                    scrollRef={scrollRef}
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
            </Card>
            <Form
                onSubmit={(event) => {
                    event.preventDefault()
                    handleCommand(command)
                    setCommand("")
                }}
            >
                <TextField.Root>
                    <TextField.Slot>
                        <ChevronRightIcon />
                    </TextField.Slot>
                    <TextField.Input
                        key={tile.id}
                        ref={inputRef}
                        value={command}
                        onChange={(event) => setCommand(event.target.value)}
                        onKeyDown={() => !command && scrollRef.current?.click()}
                        autoFocus
                    />
                    <TextField.Input type="submit" hidden />
                </TextField.Root>
            </Form>
        </Flex>
    )
}
