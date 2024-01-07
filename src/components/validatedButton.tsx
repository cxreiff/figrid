import type { IconProps } from "@radix-ui/react-icons/dist/types.js"
import { useIsSubmitting } from "remix-validated-form"
import { ButtonIcon } from "~/components/buttonIcon.tsx"
import type { ButtonProps } from "~/components/ui/button.tsx"

export function ValidatedButton({
    icon: Icon,
    type = "button",
    disabled,
    ...props
}: ButtonProps & { icon: (props: IconProps) => React.ReactNode }) {
    const isSubmitting = useIsSubmitting()

    return (
        <ButtonIcon
            icon={Icon}
            type={type}
            disabled={isSubmitting || disabled}
            {...props}
        />
    )
}
