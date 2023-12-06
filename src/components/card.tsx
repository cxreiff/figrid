import type { CardProps } from "node_modules/@itsmapleleaf/radix-themes/dist/esm/components/card.js"
import { Card as RadixCard } from "@itsmapleleaf/radix-themes"
import { twMerge } from "tailwind-merge"

export function Card({ className, ...props }: CardProps) {
    return (
        <RadixCard className={twMerge("bg-zinc-900", className)} {...props} />
    )
}
