import { useField, useFormContext } from "remix-validated-form"
import { Label } from "~/ui/primitives/label.tsx"
import { Textarea } from "~/ui/primitives/textarea.tsx"

export function ValidatedTextArea({
    id,
    label,
    placeholder,
    noAutocomplete = false,
    className,
}: {
    id: string
    label: string
    placeholder?: string
    noAutocomplete?: boolean
    className?: string
}) {
    const { error, getInputProps } = useField(id)
    const { setFieldTouched } = useFormContext()

    return (
        <div className={className}>
            <div className="mx-2 my-1 flex h-5 items-center">
                <Label className="flex-1" htmlFor={id}>
                    {label}
                </Label>
                {error && <span className="text-accent">{error}</span>}
            </div>
            <Textarea
                data-1p-ignore={noAutocomplete}
                autoComplete={noAutocomplete ? "off" : undefined}
                {...getInputProps({
                    id,
                    placeholder,
                    onChange: () => setFieldTouched(id, true),
                })}
            />
        </div>
    )
}
