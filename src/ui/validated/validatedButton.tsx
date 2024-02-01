import { useIsSubmitting } from "remix-validated-form"
import { ButtonWithIcon } from "~/ui/buttonWithIcon.tsx"
import type { ButtonProps } from "~/ui/primitives/button.tsx"
import type { IconType } from "~/lib/misc.ts"

export function ValidatedButton({
    icon: Icon,
    type = "button",
    disabled,
    ...props
}: ButtonProps & { icon: IconType }) {
    const isSubmitting = useIsSubmitting()

    return (
        <ButtonWithIcon
            icon={Icon}
            type={type}
            disabled={isSubmitting || disabled}
            {...props}
        />
    )
}
