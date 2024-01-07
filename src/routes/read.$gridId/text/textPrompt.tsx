import { ChevronRightIcon } from "@radix-ui/react-icons"
import { Form } from "@remix-run/react"
import {
    useContext,
    type Dispatch,
    type RefObject,
    type SetStateAction,
} from "react"
import { Card } from "~/components/ui/card.tsx"
import { InputWithIcon } from "~/components/ui/input.tsx"
import { WaitSaveData } from "~/components/waitSaveData.tsx"
import { availableCommands } from "~/routes/read.$gridId/commands.ts"
import type { loader } from "~/routes/read.$gridId/route.tsx"
import { ContextCommand } from "~/utilities/contextCommand.ts"
import { useSuperLoaderData } from "~/utilities/superjson.ts"

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
                <WaitSaveData className="absolute right-3 flex h-full items-center text-muted-foreground">
                    {(saveData) => {
                        const suggestions = availableCommands(
                            command,
                            tileIdMap[saveData.currentTileId],
                            saveData,
                            eventIdMap,
                            itemInstanceIdMap,
                        )
                        return suggestions
                            .slice(0, 5)
                            .join(", ")
                            .concat(suggestions.length > 5 ? " ..." : "")
                    }}
                </WaitSaveData>
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
