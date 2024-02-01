import { useIsSubmitting } from "remix-validated-form"
import { ButtonWithIcon } from "~/components/buttonWithIcon.tsx"
import type { ButtonProps } from "~/components/ui/button.tsx"
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
