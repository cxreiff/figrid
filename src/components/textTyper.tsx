import {
    useEffect,
    useRef,
    useState,
    type RefObject,
    type HTMLProps,
} from "react"

export function TextTyper({
    children: text,
    textRef: externalTextRef,
    onClick,
    className,
    ...props
}: {
    textRef?: RefObject<HTMLDivElement>
    children: string
} & Omit<HTMLProps<HTMLDivElement>, "children">) {
    const [hidden, setHidden] = useState(text.length)
    const internalTextRef = useRef<HTMLDivElement>(null)
    const textRef = externalTextRef || internalTextRef

    const [prevText, setPrevText] = useState(text)
    if (text !== prevText) {
        setHidden(text.length)
        setPrevText(text)
    }

    useEffect(() => {
        if (hidden > 0) {
            const interval = setTimeout(() => {
                setHidden((prevHidden) => Math.max(prevHidden - 3, 0))
            }, 32)
            return () => clearTimeout(interval)
        }
    }, [hidden, text])

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
            <div ref={textRef}>
                {hidden ? text.slice(0, -hidden) || " " : text}
            </div>
        </div>
    )
}
