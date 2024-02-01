import { useField, useFormContext } from "remix-validated-form"
import { Input } from "~/ui/primitives/input.tsx"
import { Label } from "~/ui/primitives/label.tsx"

export function ValidatedInput({
    id,
    label,
    noAutocomplete = false,
    disabled,
    className,
}: {
    id: string
    label: string
    noAutocomplete?: boolean
    disabled?: boolean
    className?: string
}) {
    const { error, getInputProps } = useField(id)
    const { setFieldTouched } = useFormContext()
    return (
        <div className={className}>
            <div className="mx-2 my-1 flex h-6 items-center">
                <Label className="flex-1" htmlFor={id}>
                    {label}
                </Label>
                {error && <span className="text-accent">{error}</span>}
            </div>
            <Input
                data-1p-ignore={noAutocomplete}
                autoComplete={noAutocomplete ? "off" : undefined}
                {...getInputProps({
                    id,
                    disabled,
                    placeholder: `${label}...`,
                    className: "mb-4 h-9",
                    onChange: () => setFieldTouched(id, true),
                })}
            />
        </div>
    )
}
