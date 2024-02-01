import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "~/ui/primitives/select.tsx"

export function TypeSelect<T extends string>({
    options,
    selected,
    onSelect,
}: {
    options: { value: T; label: string }[]
    selected: string
    onSelect: (selected: T) => void
}) {
    return (
        <Select value={selected} onValueChange={onSelect}>
            <SelectTrigger>
                <SelectValue />
            </SelectTrigger>
            <SelectContent>
                {options.map(({ value, label }) => (
                    <SelectItem key={value} value={value}>
                        {label}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    )
}
