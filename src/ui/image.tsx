import { useState, type HTMLProps, useEffect, useRef } from "react"
import { cn } from "~/lib/misc.ts"

export function Image({
    className,
    alt,
    fade = false,
    ...props
}: HTMLProps<HTMLImageElement> & { fade?: boolean }) {
    const [loaded, setLoaded] = useState(false)
    const imgRef = useRef<HTMLImageElement>(null)

    useEffect(() => {
        if (imgRef.current?.complete) {
            setLoaded(true)
        }
    }, [setLoaded, imgRef])

    return (
        <img
            ref={imgRef}
            className={cn(
                "pixel-image m-auto max-h-full w-auto max-w-full rounded-md object-contain",
                { "transition-opacity duration-500": fade },
                className,
            )}
            style={fade ? { opacity: loaded ? 1 : 0 } : undefined}
            alt={alt}
            onLoad={() => setLoaded(true)}
            {...props}
        />
    )
}
