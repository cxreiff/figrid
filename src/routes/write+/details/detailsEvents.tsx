import { LayoutAccordion } from "~/components/layoutAccordion.tsx"

export function DetailsEvents({
    expanded,
    setExpanded,
}: {
    expanded: string[]
    setExpanded: (expanded: string[]) => void
}) {
    return (
        <LayoutAccordion
            names={["parent", "children", "locks", "items", "requirements"]}
            expanded={expanded}
            setExpanded={setExpanded}
        >
            {[
                "parent can be character, tile, or event with trigger",
                "list of child events",
                "list of locks that are locked or unlocked by event",
                "list of items that are granted by event",
                "list of requirements to trigger event",
            ]}
        </LayoutAccordion>
    )
}
