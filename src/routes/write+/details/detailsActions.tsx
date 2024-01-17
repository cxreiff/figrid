import { CodeIcon } from "@radix-ui/react-icons"
import { ButtonIcon } from "~/components/buttonIcon.tsx"
import { LayoutTitledScrolls } from "~/components/layout/layoutTitledScrolls.tsx"
import { Card } from "~/components/ui/card.tsx"

export function DetailsActions() {
    return (
        <Card className="h-full p-3">
            <LayoutTitledScrolls>
                <ButtonIcon icon={CodeIcon}>Test Button</ButtonIcon>
            </LayoutTitledScrolls>
        </Card>
    )
}
