import { type ReactNode } from "react"
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "~/components/ui/accordion.tsx"

export function LayoutAccordion({
    expanded,
    setExpanded,
    children,
}: {
    expanded: string[]
    setExpanded: (expanded: string[]) => void
    children: { [key: string]: ReactNode }
}) {
    return (
        <Accordion type="multiple" value={expanded} onValueChange={setExpanded}>
            {Object.entries(children).map(([name, child]) => (
                <AccordionItem key={name} value={name}>
                    <AccordionTrigger>{name}</AccordionTrigger>
                    <AccordionContent>{child}</AccordionContent>
                </AccordionItem>
            ))}
        </Accordion>
    )
}
