import { Card, Tabs } from "@itsmapleleaf/radix-themes"
import type { ReactNode } from "react"

export function LayoutTabs<T extends string[]>({
    names,
    children,
}: {
    names: [...T]
    children: [...{ [I in keyof T]: ReactNode }]
}) {
    return (
        <Tabs.Root
            defaultValue={names[0]}
            className="flex h-full flex-col gap-4"
        >
            {children.map((content, index) => (
                <Tabs.Content
                    key={names[index]}
                    value={names[index]}
                    className="h-[calc(100%-4rem)]"
                >
                    {content}
                </Tabs.Content>
            ))}
            <Card className="no-card-padding h-[calc(3rem+1px)]">
                <Tabs.List className="mx-4 h-[calc(3rem+1px)] shadow-none">
                    {names.map((name) => (
                        <Tabs.Trigger key={name} value={name}>
                            {name}
                        </Tabs.Trigger>
                    ))}
                </Tabs.List>
            </Card>
        </Tabs.Root>
    )
}
