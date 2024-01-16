import type { CheckboxProps } from "@radix-ui/react-checkbox"
import { Checkbox } from "~/components/ui/checkbox.tsx"
import { cn } from "~/lib/misc.ts"

export function LabeledCheckbox({
    label,
    description,
    id,
    className,
    ...props
}: CheckboxProps & { label: string; description?: string }) {
    return (
        <div className={cn("items-top flex space-x-2", className)}>
            <Checkbox id={id} {...props} />
            <div className="group grid gap-1.5 leading-none peer-disabled:cursor-auto peer-disabled:text-muted peer-disabled:[&>p]:text-muted">
                <label
                    htmlFor={id}
                    className="text-sm font-medium leading-none "
                >
                    {label}
                </label>
                {description && (
                    <p className="text-sm text-muted-foreground">
                        {description}
                    </p>
                )}
            </div>
        </div>
    )
}
