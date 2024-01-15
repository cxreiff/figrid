import { useState } from "react"
import { cn } from "~/lib/misc.ts"
import { Button, type ButtonProps } from "~/components/ui/button.tsx"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
} from "~/components/ui/command.tsx"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "~/components/ui/popover.tsx"
import type { IconProps } from "@radix-ui/react-icons/dist/types.js"

export function ActionBox<T extends { id: string | number; label: string }>({
    children,
    className,
    options,
    icon: Icon,
    onOptionSelect,
    ...props
}: ButtonProps & {
    className?: string
    options: T[]
    icon: (props: IconProps) => React.ReactNode
    onOptionSelect: (selectedId: T) => void
}) {
    const [open, setOpen] = useState(false)

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger aria-expanded={open} {...props} asChild>
                <Button
                    role="combobox"
                    variant="ghost"
                    aria-expanded={open}
                    className={cn(
                        "h-full w-full items-center justify-between p-1",
                        {
                            "justify-center": !children,
                            "justify-between": !!children,
                        },
                        className,
                    )}
                    {...props}
                >
                    {children}
                    <div className="flex h-9 w-9 items-center justify-center">
                        <Icon />
                    </div>
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[18.75rem] p-0">
                <Command>
                    <CommandInput placeholder="search..." className="h-9" />
                    <CommandEmpty>none found.</CommandEmpty>
                    <CommandGroup>
                        {options.map((option) => (
                            <CommandItem
                                key={option.id}
                                className="cursor-pointer hover:bg-[hsla(var(--accent)/0.4)]"
                                onSelect={() => {
                                    onOptionSelect(option)
                                    setOpen(false)
                                }}
                            >
                                {option.label}
                            </CommandItem>
                        ))}
                    </CommandGroup>
                </Command>
            </PopoverContent>
        </Popover>
    )
}
