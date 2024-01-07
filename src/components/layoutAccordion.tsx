import { type ReactNode } from "react"
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "~/components/ui/accordion.tsx"

export function LayoutAccordion<T extends string[]>({
    names,
    expanded,
    setExpanded,
    children,
}: {
    names: readonly [...T]
    expanded: string[]
    setExpanded: (expanded: string[]) => void
    children: [...{ [I in keyof T]: ReactNode }]
}) {
    return (
        <Accordion type="multiple" value={expanded} onValueChange={setExpanded}>
            {children.map((child, index) => (
                <AccordionItem
                    key={`${index}.${names[index]}`}
                    value={names[index]}
                >
                    <AccordionTrigger>{names[index]}</AccordionTrigger>
                    <AccordionContent>{child}</AccordionContent>
                </AccordionItem>
            ))}
        </Accordion>
    )
}
