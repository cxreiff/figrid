import { useField, useFormContext } from "remix-validated-form"
import { Label } from "~/components/ui/label.tsx"
import { Textarea } from "~/components/ui/textarea.tsx"

export function ValidatedTextArea({
    id,
    label,
    noAutocomplete = false,
    className,
}: {
    id: string
    label: string
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
                    placeholder: `${label}...`,
                    onChange: () => setFieldTouched(id, true),
                })}
            />
        </div>
    )
}
