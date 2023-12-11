import { useState, type HTMLProps } from "react"
import * as tailwindMerge from "tailwind-merge"

export function Image({
    className,
    alt,
    ...props
}: HTMLProps<HTMLImageElement>) {
    const [loaded, setLoaded] = useState(false)
    return (
        <img
            className={tailwindMerge.twMerge(
                "pixel-image m-auto h-full max-w-full rounded-lg object-contain",
                className,
            )}
            style={{
                opacity: loaded ? 1 : 0,
                transition: "opacity 200ms ease-in-out",
            }}
            alt={alt}
            onLoad={() => setLoaded(true)}
            {...props}
        />
    )
}
