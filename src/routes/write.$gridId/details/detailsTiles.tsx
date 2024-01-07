import { LayoutAccordion } from "~/components/layoutAccordion.tsx"

export function DetailsTiles({
    expanded,
    setExpanded,
}: {
    expanded: string[]
    setExpanded: (expanded: string[]) => void
}) {
    return (
        <LayoutAccordion
            names={["gates", "characters", "items", "events"]}
            expanded={expanded}
            setExpanded={setExpanded}
        >
            {[
                "list of gates",
                "list of characters",
                "list of items",
                "list of events",
            ]}
        </LayoutAccordion>
    )
}
