import { useEffect, useState, type ComponentProps } from "react"

export function TextTyper({
    text,
    style,
    onClick,
    ...props
}: { text: string } & ComponentProps<"div">) {
    const [hidden, setHidden] = useState(text.length)

    useEffect(() => {
        setHidden(text.length)
    }, [text])

    useEffect(() => {
        if (hidden > 0) {
            setTimeout(() => {
                setHidden((prevHidden) => Math.max(prevHidden - 4, 0))
            }, 32)
        }
    }, [hidden, text])

    return (
        <div
            {...props}
            style={{
                ...style,
                position: "relative",
                whiteSpace: "pre-wrap",
            }}
            onClick={(event) => {
                onClick?.(event)
                setHidden(0)
            }}
        >
            <div className="pointer-events-none invisible">{text}</div>
            <noscript className="absolute inset-0 p-[inherit]">{text}</noscript>
            <div className="absolute inset-0 p-[inherit]">
                {hidden ? text.slice(0, -hidden) : text}
            </div>
        </div>
    )
}
