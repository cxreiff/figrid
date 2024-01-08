import { LayoutAccordion } from "~/components/layoutAccordion.tsx"

export function DetailsItems({
    expanded,
    setExpanded,
}: {
    expanded: string[]
    setExpanded: (expanded: string[]) => void
}) {
    return (
        <LayoutAccordion
            names={["tiles", "events"]}
            expanded={expanded}
            setExpanded={setExpanded}
        >
            {[
                "list of item instances in tiles",
                "list of item instances in events",
            ]}
        </LayoutAccordion>
    )
}
