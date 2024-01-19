import type { IconProps } from "@radix-ui/react-icons/dist/types.js"
import type { ReactNode } from "react"
import { ButtonIcon } from "~/components/buttonIcon.tsx"
import { cn } from "~/lib/misc.ts"

type Option<T> = {
    id: T
    icon: (props: IconProps) => ReactNode
    label?: string
}

export function ButtonGroup<T extends string>({
    className,
    options,
    selected,
    onSelect,
}: {
    className?: string
    options: Option<T>[]
    selected: Option<T>["id"]
    onSelect: (option: Option<T>["id"]) => void
}) {
    return (
        <div className={cn("w-fit rounded-lg border border-accent", className)}>
            {options.map((option) => (
                <ButtonIcon
                    key={option.id}
                    icon={option.icon}
                    variant="ghost"
                    size="icon"
                    data-selected={selected === option.id}
                    onClick={() => onSelect(option.id)}
                    className={cn(
                        "rounded-none first:rounded-l-md last:rounded-r-md data-[selected=true]:bg-[hsla(var(--accent)/0.4)] data-[selected=true]:text-accent-foreground",
                        {
                            "rounded-l-md": option.id === options[0].id,
                            "rounded-r-md":
                                option.id === options[options.length - 1].id,
                        },
                    )}
                >
                    {option.label}
                </ButtonIcon>
            ))}
        </div>
    )
}
