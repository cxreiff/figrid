import { ChevronRightIcon } from "@radix-ui/react-icons"
import { Form } from "@remix-run/react"
import {
    useContext,
    type Dispatch,
    type RefObject,
    type SetStateAction,
} from "react"
import { Card } from "~/ui/primitives/card.tsx"
import { InputWithIcon } from "~/ui/primitives/input.tsx"
import { WaitSaveData } from "~/ui/waitSaveData.tsx"
import { availableCommands } from "~/routes/read+/lib/commands.ts"
import type { loader } from "~/routes/read+/$gridId.tsx"
import { ContextCommand } from "~/lib/contextCommand.ts"
import { useSuperLoaderData } from "~/lib/superjson.ts"

export function TextPrompt({
    command,
    inputRef,
    setCommand,
}: {
    command: string
    inputRef: RefObject<HTMLInputElement>
    setCommand: Dispatch<SetStateAction<string>>
}) {
    const { tileIdMap, eventIdMap, itemInstanceIdMap } =
        useSuperLoaderData<typeof loader>()
    const handleCommand = useContext(ContextCommand)

    return (
        <Card className="relative h-10">
            <Form
                className="h-full"
                onSubmit={(event) => {
                    event.preventDefault()
                    handleCommand(command)
                }}
            >
                <div className="absolute left-[50%] right-3 flex h-full items-center text-muted-foreground">
                    <WaitSaveData className="w-full overflow-hidden overflow-ellipsis whitespace-nowrap text-right">
                        {(saveData) =>
                            availableCommands(
                                command,
                                tileIdMap[saveData.currentTileId],
                                saveData,
                                eventIdMap,
                                itemInstanceIdMap,
                            ).join(", ")
                        }
                    </WaitSaveData>
                </div>
                <InputWithIcon
                    icon={ChevronRightIcon}
                    className="h-full border-none shadow-none [&>input]:border-none [&>input]:pl-7 [&>svg]:left-2"
                    ref={inputRef}
                    value={command}
                    onChange={(event) =>
                        setCommand(event.target.value.toLowerCase())
                    }
                />
            </Form>
        </Card>
    )
}
