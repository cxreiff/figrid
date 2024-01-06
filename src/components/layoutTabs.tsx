import { type ReactNode } from "react"
import { Card } from "~/components/ui/card.tsx"
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "~/components/ui/tabs.tsx"

export function LayoutTabs<T extends string[]>({
    names,
    defaultTab = names[0],
    children,
}: {
    names: readonly [...T]
    defaultTab?: (typeof names)[number]
    children: [...{ [I in keyof T]: ReactNode }]
}) {
    return (
        <Tabs
            defaultValue={defaultTab}
            className="relative mt-0 h-full flex-col gap-4"
        >
            {children.map((content, index) => (
                <TabsContent
                    key={names[index]}
                    value={names[index]}
                    className="absolute bottom-14 top-0 w-full"
                >
                    {content}
                </TabsContent>
            ))}
            <Card className="absolute bottom-0 h-10 w-full">
                <TabsList className="h-full w-full justify-start">
                    {names.map((name) => (
                        <TabsTrigger key={name} value={name}>
                            {name}
                        </TabsTrigger>
                    ))}
                </TabsList>
            </Card>
        </Tabs>
    )
}
