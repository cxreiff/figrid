import { useState, type PropsWithChildren, type ReactNode } from "react"
import { Card } from "~/components/ui/card.tsx"
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "~/components/ui/collapsible.tsx"

export function CardCollapsible({
    header,
    children,
}: PropsWithChildren<{ header: ReactNode }>) {
    const [open, setOpen] = useState(false)
    return (
        <Card className="mb-2">
            <Collapsible open={open} onOpenChange={setOpen}>
                <CollapsibleTrigger>{header}</CollapsibleTrigger>
                <CollapsibleContent>{children}</CollapsibleContent>
            </Collapsible>
        </Card>
    )
}
