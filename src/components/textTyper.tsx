import {
    useEffect,
    useRef,
    useState,
    type RefObject,
    type HTMLProps,
} from "react"

export function TextTyper({
    text,
    textRef: externalTextRef,
    onClick,
    className,
    ...props
}: {
    text: string
    textRef?: RefObject<HTMLDivElement>
} & HTMLProps<HTMLDivElement>) {
    const [hidden, setHidden] = useState(text.length)
    const endRef = useRef<HTMLDivElement>(null)
    const internalTextRef = useRef<HTMLDivElement>(null)
    const textRef = externalTextRef || internalTextRef

    const [prevText, setPrevText] = useState(text)
    if (text !== prevText) {
        setHidden(text.length)
        setPrevText(text)
    }

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
        if (hidden > 0) {
            const interval = setTimeout(() => {
                setHidden((prevHidden) => Math.max(prevHidden - 4, 0))
            }, 32)
            return () => clearTimeout(interval)
        } else {
            endRef.current?.scrollIntoView()
        }
    }, [hidden, text, endRef])

    return (
        <div
            {...props}
            className={`${className} whitespace-pre-wrap`}
            onClick={(event) => {
                onClick?.(event)
                setHidden(0)
            }}
        >
            <noscript>{text}</noscript>
            <div ref={textRef}>{hidden ? text.slice(0, -hidden) : text}</div>
            <div ref={endRef} className="invisible" />
        </div>
    )
}
