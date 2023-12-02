import { ScrollArea } from "@itsmapleleaf/radix-themes"
import type { ScrollAreaProps } from "node_modules/@itsmapleleaf/radix-themes/dist/esm/components/scroll-area.js"
import { useEffect, useRef, useState, type RefObject } from "react"

export function TextTyper({
    text,
    textRef: externalTextRef,
    style,
    onClick,
    ...props
}: { text: string; textRef?: RefObject<HTMLDivElement> } & ScrollAreaProps) {
    const [hidden, setHidden] = useState(text.length)
    const endRef = useRef<HTMLDivElement>(null)
    const internalTextRef = useRef<HTMLDivElement>(null)
    const textRef = externalTextRef || internalTextRef

    useEffect(() => {
        if (textRef.current && endRef.current) {
            const resizeObserver = new ResizeObserver(() => {
                endRef.current?.scrollIntoView()
            })
            resizeObserver.observe(textRef.current)
            return () => resizeObserver.disconnect()
        }
    }, [textRef, endRef])

    useEffect(() => {
        setHidden(text.length)
    }, [text])

    useEffect(() => {
        if (hidden > 0) {
            setTimeout(() => {
                setHidden((prevHidden) => Math.max(prevHidden - 4, 0))
            }, 32)
        } else {
            endRef.current?.scrollIntoView()
        }
    }, [hidden, text, endRef])

    return (
        <ScrollArea
            {...props}
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
            <div ref={textRef}>{hidden ? text.slice(0, -hidden) : text}</div>
            <div ref={endRef} className="invisible" />
        </ScrollArea>
    )
}
