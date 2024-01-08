import { Card } from "~/components/ui/card.tsx"
import { useRef, type Dispatch, type SetStateAction, useEffect } from "react"
import { TextContent } from "~/routes/read+/text/textContent.tsx"
import { TextPrompt } from "~/routes/read+/text/textPrompt.tsx"
import type { SaveData } from "~/lib/useSaveData.ts"

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

    useEffect(
        () => inputRef?.current?.focus(),
        [saveData?.currentTileId, saveData?.currentEventId],
    )

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
            className="relative h-full flex-col gap-4"
            onClick={() => {
                textRef.current?.click()
            }}
        >
            <Card className="absolute bottom-14 top-0 w-full p-2">
                <div
                    ref={scrollRef}
                    className="h-full flex-1 overflow-auto p-5"
                >
                    <TextContent commandLog={commandLog} textRef={textRef} />
                </div>
            </Card>
            <div className="absolute bottom-0 h-10 w-full">
                <TextPrompt
                    command={command}
                    setCommand={setCommand}
                    inputRef={inputRef}
                />
            </div>
        </div>
    )
}
