import { DoubleArrowDownIcon, DoubleArrowUpIcon } from "@radix-ui/react-icons"
import { useParams } from "@remix-run/react"
import type { Dispatch, ReactElement, ReactNode } from "react"
import { ButtonIcon } from "~/components/buttonIcon.tsx"
import { LayoutAccordion } from "~/components/layout/layoutAccordion.tsx"
import { LayoutTitledScrolls } from "~/components/layout/layoutTitledScrolls.tsx"
import { Card } from "~/components/ui/card.tsx"
import { paramsSchema } from "~/routes/write+/$gridId+/+$resourceType.$resourceId.tsx"

export function DetailsInfo({
    expanded,
    setExpanded,
    mainSection: MainSection,
    accordionSection,
}: {
    expanded: string[]
    setExpanded: Dispatch<string[]>
    mainSection?: () => ReactNode
    accordionSection: { [key: string]: () => ReactElement }
}) {
    const { resourceType, resourceId } = paramsSchema
        .partial()
        .parse(useParams())

    return (
        <Card className="h-full p-4 pb-0">
            {resourceType && resourceId && (
                <LayoutTitledScrolls
                    title="details"
                    actionSlot={
                        expanded.length ===
                        Object.keys(accordionSection).length ? (
                            <ButtonIcon
                                icon={DoubleArrowUpIcon}
                                onClick={() => setExpanded([])}
                            />
                        ) : (
                            <ButtonIcon
                                icon={DoubleArrowDownIcon}
                                onClick={() =>
                                    setExpanded(Object.keys(accordionSection))
                                }
                            />
                        )
                    }
                >
                    {MainSection && (
                        <div className="border-b pb-4">
                            <MainSection />
                        </div>
                    )}
                    <LayoutAccordion
                        key={resourceType}
                        expanded={expanded}
                        setExpanded={setExpanded}
                    >
                        {Object.entries(accordionSection).reduce(
                            (map, [name, Component]) => ({
                                ...map,
                                [name]: <Component />,
                            }),
                            {},
                        )}
                    </LayoutAccordion>
                </LayoutTitledScrolls>
            )}
        </Card>
    )
}
