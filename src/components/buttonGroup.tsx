import type { IconProps } from "@radix-ui/react-icons/dist/types.js"
import type { ReactNode } from "react"
import { ButtonIcon } from "~/components/buttonIcon.tsx"
import { cn } from "~/utilities/misc.ts"

type Option<T> = {
    key: T
    icon: (props: IconProps) => ReactNode
}

export function ButtonGroup<T extends string>({
    options,
    selected,
    onSelect,
}: {
    options: Option<T>[]
    selected: Option<T>["key"]
    onSelect: (option: Option<T>["key"]) => void
}) {
    return (
        <span className="rounded-lg border border-accent">
            {options.map((option) => (
                <ButtonIcon
                    key={option.key}
                    icon={option.icon}
                    variant="ghost"
                    size="icon"
                    data-selected={selected === option.key}
                    onClick={() => onSelect(option.key)}
                    className={cn(
                        "rounded-none first:rounded-l-md last:rounded-r-md data-[selected=true]:bg-[hsla(var(--accent)/0.4)] data-[selected=true]:text-accent-foreground",
                        {
                            "rounded-l-md": option.key === options[0].key,
                            "rounded-r-md":
                                option.key === options[options.length - 1].key,
                        },
                    )}
                />
            ))}
        </span>
    )
}
