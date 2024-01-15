import { useNavigation } from "@remix-run/react"
import { useEffect, useRef, useState } from "react"
import { cn } from "~/lib/misc.ts"

export function LoadingIndicator() {
    const navigation = useNavigation()
    const active = navigation.state !== "idle"

    const ref = useRef<HTMLDivElement>(null)
    const [animationComplete, setAnimationComplete] = useState(true)

    useEffect(() => {
        if (!ref.current) return
        if (active) setAnimationComplete(false)

        Promise.allSettled(
            ref.current.getAnimations().map(({ finished }) => finished),
        ).then(() => !active && setAnimationComplete(true))
    }, [active])

    return (
        <div
            role="progressbar"
            aria-hidden={!active}
            aria-valuetext={active ? "Loading" : undefined}
            className="fixed inset-x-0 top-0 z-50 h-[0.2rem]"
        >
            <div
                ref={ref}
                className={cn(
                    "h-full bg-accent-foreground transition-[width,opacity] duration-500 ease-in-out",
                    navigation.state === "idle" &&
                        animationComplete &&
                        "opacity-0 transition-opacity duration-300",
                    navigation.state === "submitting" && "w-4/12",
                    navigation.state === "loading" && "w-11/12",
                    navigation.state === "idle" &&
                        !animationComplete &&
                        "w-full",
                )}
            />
        </div>
    )
}
