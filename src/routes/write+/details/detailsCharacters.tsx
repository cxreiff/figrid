import { LayoutAccordion } from "~/components/layoutAccordion.tsx"

export function DetailsCharacters({
    expanded,
    setExpanded,
}: {
    expanded: string[]
    setExpanded: (expanded: string[]) => void
}) {
    return (
        <LayoutAccordion
            names={["tiles", "dialogue"]}
            expanded={expanded}
            setExpanded={setExpanded}
        >
            {[
                "list of character instances in tiles",
                "list of dialogue events",
            ]}
        </LayoutAccordion>
    )
}
