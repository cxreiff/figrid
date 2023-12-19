import { TextField } from "@itsmapleleaf/radix-themes"
import { ChevronRightIcon } from "@radix-ui/react-icons"
import { Form } from "@remix-run/react"
import type { Dispatch, RefObject, SetStateAction } from "react"
import { Wait } from "~/components/wait.tsx"
import { availableCommands } from "~/routes/read.$gridId/commands.ts"
import type {
    IdMap,
    TileWithCoords,
} from "~/routes/read.$gridId/processing.server.ts"
import type { GridQuery } from "~/routes/read.$gridId/query.server.ts"
import type { SaveData } from "~/utilities/useSaveData.ts"

export function TextPrompt({
    saveData,
    command,
    textRef,
    inputRef,
    tileIdMap,
    eventIdMap,
    itemInstanceIdMap,
    setCommand,
    handleCommand,
}: {
    saveData?: SaveData
    command: string
    textRef: RefObject<HTMLDivElement>
    inputRef: RefObject<HTMLInputElement>
    tileIdMap: IdMap<TileWithCoords>
    eventIdMap: IdMap<GridQuery["events"][0]>
    itemInstanceIdMap: IdMap<GridQuery["item_instances"][0]>
    setCommand: Dispatch<SetStateAction<string>>
    handleCommand: (command: string) => void
}) {
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
                    onKeyDown={() => !command && textRef.current?.click()}
                    autoFocus
                />
                <TextField.Input type="submit" hidden />
                <TextField.Slot className="pr-3 text-right text-zinc-500">
                    <Wait on={saveData} asChild>
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
                    </Wait>
                </TextField.Slot>
            </TextField.Root>
        </Form>
    )
}
