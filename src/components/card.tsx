import type { CardProps } from "node_modules/@itsmapleleaf/radix-themes/dist/esm/components/card.js"
import { Card as RadixCard } from "@itsmapleleaf/radix-themes"
import * as tailwindMerge from "tailwind-merge"

export function Card({ className, ...props }: CardProps) {
    return (
        <RadixCard
            className={tailwindMerge.twMerge("bg-zinc-900", className)}
            {...props}
        />
    )
}
