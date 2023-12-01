import { ScrollArea } from "@itsmapleleaf/radix-themes"
import type { ScrollAreaProps } from "node_modules/@itsmapleleaf/radix-themes/dist/esm/components/scroll-area.js"
import { useEffect, useRef, useState } from "react"

export function TextTyper({
    text,
    style,
    onClick,
    ...props
}: { text: string } & ScrollAreaProps) {
    const [hidden, setHidden] = useState(text.length)
    const scrollRef = useRef<HTMLDivElement>(null)
    const bottomRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (scrollRef.current && bottomRef.current) {
            const resizeObserver = new ResizeObserver(() => {
                bottomRef.current?.scrollIntoView()
            })
            resizeObserver.observe(scrollRef.current);
            return () => resizeObserver.disconnect()
        }
    }, [scrollRef, bottomRef])

    useEffect(() => {
        setHidden(text.length)
    }, [text])

    useEffect(() => {
        if (hidden > 0) {
            setTimeout(() => {
                setHidden((prevHidden) => Math.max(prevHidden - 4, 0))
            }, 32)
        } else {
            bottomRef.current?.scrollIntoView()
        }
    }, [hidden, text])

    return (
        <ScrollArea
            {...props}
            ref={scrollRef}
            style={{
                ...style,
                padding: "1.5rem",
                whiteSpace: "pre-wrap",
            }}
            onClick={(event) => {
                onClick?.(event)
                setHidden(0)
            }}
        >
            <noscript>{text}</noscript>
            <div>
                {hidden ? text.slice(0, -hidden) : text}
            </div>
            <div ref={bottomRef} className="invisible" />
        </ScrollArea>
    )
}
