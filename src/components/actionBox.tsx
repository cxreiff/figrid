import { useState } from "react"
import { PlusIcon } from "@radix-ui/react-icons"
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

export function ActionBox<T extends { id: string | number; label: string }>({
    children,
    className,
    options,
    onOptionSelect,
    ...props
}: ButtonProps & {
    className: string
    options: T[]
    onOptionSelect: (selectedId: T) => void
}) {
    const [open, setOpen] = useState(false)

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className={cn(
                        "h-full w-full justify-between px-2 py-1 shadow",
                        className,
                    )}
                    {...props}
                >
                    <div className="px-2">{children}</div>
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center">
                        <PlusIcon className="h-4 w-4" />
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
                                className="cursor-pointer"
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
