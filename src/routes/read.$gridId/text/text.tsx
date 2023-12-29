import { Card } from "@itsmapleleaf/radix-themes"
import { useRef, type Dispatch, type SetStateAction, useEffect } from "react"
import { TextContent } from "~/routes/read.$gridId/text/textContent.tsx"
import { TextPrompt } from "~/routes/read.$gridId/text/textPrompt.tsx"
import type { SaveData } from "~/utilities/useSaveData.ts"

export function Text({
    saveData,
    command,
    commandLog,
    setCommand,
}: {
    saveData?: SaveData
    command: string
    commandLog: string[]
    setCommand: Dispatch<SetStateAction<string>>
}) {
    const inputRef = useRef<HTMLInputElement>(null)
    const textRef = useRef<HTMLDivElement>(null)
    const scrollRef = useRef<HTMLDivElement>(null)

    useEffect(() => inputRef?.current?.focus(), [saveData?.currentTileId])

    useEffect(() => {
        setTimeout(() => {
            if (scrollRef.current) {
                scrollRef.current.scrollTo({
                    top: scrollRef.current.scrollHeight,
                    behavior: "smooth",
                })
            }
        }, 64)
    }, [commandLog.length])

    return (
        <div
            className="flex h-full flex-col gap-4"
            onClick={() => {
                inputRef.current?.focus()
                textRef.current?.click()
            }}
        >
            <Card className="h-[calc(100%-4rem)]">
                <div
                    ref={scrollRef}
                    className="h-full flex-1 overflow-auto p-5"
                >
                    <TextContent commandLog={commandLog} textRef={textRef} />
                </div>
            </Card>
            <TextPrompt
                command={command}
                setCommand={setCommand}
                inputRef={inputRef}
                textRef={textRef}
            />
        </div>
    )
}
