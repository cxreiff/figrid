import { LayoutTitledScrolls } from "~/components/layoutTitledScrolls.tsx"
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "~/components/ui/accordion.tsx"
import { Card } from "~/components/ui/card.tsx"
import type { SelectedResource } from "~/routes/write.$gridId/route.tsx"

export function Details({ selected }: { selected: SelectedResource }) {
    return (
        <Card className="h-full p-4 pb-0">
            {selected && (
                <LayoutTitledScrolls title="details">
                    <Accordion type="single" collapsible>
                        <AccordionItem value="gates">
                            <AccordionTrigger>gates</AccordionTrigger>
                            <AccordionContent>list of gates</AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="characters">
                            <AccordionTrigger>characters</AccordionTrigger>
                            <AccordionContent>
                                list of characters
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="items">
                            <AccordionTrigger>items</AccordionTrigger>
                            <AccordionContent>list of items</AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="events">
                            <AccordionTrigger>events</AccordionTrigger>
                            <AccordionContent>list of events</AccordionContent>
                        </AccordionItem>
                    </Accordion>
                </LayoutTitledScrolls>
            )}
        </Card>
    )
}
