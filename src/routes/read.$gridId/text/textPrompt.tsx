import { TextField } from "@itsmapleleaf/radix-themes"
import { ChevronRightIcon } from "@radix-ui/react-icons"
import { Form } from "@remix-run/react"
import {
    useContext,
    type Dispatch,
    type RefObject,
    type SetStateAction,
} from "react"
import { WaitSaveData } from "~/components/waitSaveData.tsx"
import { availableCommands } from "~/routes/read.$gridId/commands.ts"
import type { loader } from "~/routes/read.$gridId/route.tsx"
import { ContextCommand } from "~/utilities/contextCommand.ts"
import { useSuperLoaderData } from "~/utilities/superjson.ts"

export function TextPrompt({
    command,
    textRef,
    inputRef,
    setCommand,
}: {
    command: string
    textRef: RefObject<HTMLDivElement>
    inputRef: RefObject<HTMLInputElement>
    setCommand: Dispatch<SetStateAction<string>>
}) {
    const { tileIdMap, eventIdMap, itemInstanceIdMap } =
        useSuperLoaderData<typeof loader>()
    const handleCommand = useContext(ContextCommand)

    return (
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
                    onKeyDown={(e) => {
                        if (
                            !(
                                e.altKey ||
                                e.ctrlKey ||
                                e.shiftKey ||
                                e.metaKey
                            ) &&
                            !command
                        ) {
                            textRef.current?.click()
                        }
                    }}
                    autoFocus
                />
                <TextField.Input type="submit" hidden />
                <TextField.Slot className="pr-3 text-right text-zinc-500">
                    <WaitSaveData asChild>
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
                </TextField.Slot>
            </TextField.Root>
        </Form>
    )
}
