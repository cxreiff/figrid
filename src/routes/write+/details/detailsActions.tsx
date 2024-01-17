import { CodeIcon } from "@radix-ui/react-icons"
import { ButtonIcon } from "~/components/buttonIcon.tsx"
import { LayoutTitledScrolls } from "~/components/layout/layoutTitledScrolls.tsx"

export function DetailsActions() {
    return (
        <LayoutTitledScrolls title="actions">
            <div className="flex gap-3">
                <ButtonIcon className="w-1/2" icon={CodeIcon} variant="outline">
                    Test Button
                </ButtonIcon>
                <ButtonIcon className="w-1/2" icon={CodeIcon} variant="outline">
                    Test Button
                </ButtonIcon>
            </div>
        </LayoutTitledScrolls>
    )
}
