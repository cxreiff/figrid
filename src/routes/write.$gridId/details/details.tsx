import { DoubleArrowDownIcon, DoubleArrowUpIcon } from "@radix-ui/react-icons"
import { useParams } from "@remix-run/react"
import { useEffect, useState } from "react"
import { ButtonIcon } from "~/components/buttonIcon.tsx"
import { LayoutTitledScrolls } from "~/components/layoutTitledScrolls.tsx"
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "~/components/ui/accordion.tsx"
import { Card } from "~/components/ui/card.tsx"
import { paramsSchema } from "~/routes/write.$gridId.$resourceType.$resourceId/route.tsx"

const ACCORDION_KEYS = ["gates", "characters", "items", "events"]

export function Details() {
    const [expanded, setExpanded] = useState<string[]>([])
    const { resourceType } = paramsSchema.partial().parse(useParams())

    useEffect(() => {
        setExpanded(ACCORDION_KEYS)
    }, [])

    return (
        <Card className="h-full p-4 pb-0">
            {resourceType && (
                <LayoutTitledScrolls
                    title="details"
                    actionSlot={
                        <>
                            <ButtonIcon
                                icon={DoubleArrowUpIcon}
                                onClick={() => setExpanded([])}
                            />
                            <ButtonIcon
                                icon={DoubleArrowDownIcon}
                                onClick={() => setExpanded(ACCORDION_KEYS)}
                            />
                        </>
                    }
                >
                    <Accordion
                        type="multiple"
                        value={expanded}
                        onValueChange={setExpanded}
                    >
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
