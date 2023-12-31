import { ChevronRightIcon } from "@radix-ui/react-icons"
import { Form } from "@remix-run/react"
import {
    useContext,
    type Dispatch,
    type RefObject,
    type SetStateAction,
} from "react"
import { Input } from "~/components/ui/input.tsx"
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
        <Form
            className="relative h-12 border-zinc-700 pb-1"
            onSubmit={(event) => {
                event.preventDefault()
                handleCommand(command)
            }}
        >
            <ChevronRightIcon className="absolute left-2 h-10" />
            <WaitSaveData className="absolute right-3 flex h-10 items-center text-muted-foreground">
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
            <Input
                ref={inputRef}
                className="h-10 pl-7"
                value={command}
                onChange={(event) =>
                    setCommand(event.target.value.toLowerCase())
                }
            />
        </Form>
    )
}
