import { DoubleArrowDownIcon, DoubleArrowUpIcon } from "@radix-ui/react-icons"
import type { Dispatch, ReactElement, ReactNode } from "react"
import { ButtonIcon } from "~/components/buttonIcon.tsx"
import { LayoutAccordion } from "~/components/layout/layoutAccordion.tsx"
import { LayoutTitledScrolls } from "~/components/layout/layoutTitledScrolls.tsx"
import type { ResourceType } from "~/routes/write+/+$gridId.tsx"

export function DetailsInfo({
    resourceType,
    expanded,
    setExpanded,
    mainSection: MainSection,
    accordionSection,
}: {
    resourceType: ResourceType
    expanded: string[]
    setExpanded: Dispatch<string[]>
    mainSection?: () => ReactNode
    accordionSection: { [key: string]: () => ReactElement }
}) {
    return (
        <LayoutTitledScrolls
            title="details"
            actionSlot={
                expanded.length === Object.keys(accordionSection).length ? (
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
    )
}