import { type ReactNode } from "react"
import { Card } from "~/components/ui/card.tsx"
import { ScrollArea, ScrollBar } from "~/components/ui/scroll-area.tsx"
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "~/components/ui/tabs.tsx"

export function LayoutTabs<T extends string[]>({
    names,
    defaultValue = names[0],
    value,
    onValueChange,
    children,
}: {
    names: readonly [...T]
    defaultValue?: (typeof names)[number]
    value?: (typeof names)[number]
    onValueChange?: (value: (typeof names)[number]) => void
    children: [...{ [I in keyof T]: ReactNode }]
}) {
    return (
        <Tabs
            defaultValue={defaultValue}
            value={value}
            onValueChange={onValueChange}
            className="relative mt-0 h-full flex-col gap-4"
        >
            {children.map((child, index) => (
                <TabsContent
                    key={names[index]}
                    value={names[index]}
                    className="absolute bottom-14 top-0 w-full"
                >
                    {child}
                </TabsContent>
            ))}
            <Card className="absolute bottom-0 h-10 w-full">
                <ScrollArea className="h-full w-full [&>div>div]:!block [&>div>div]:h-full">
                    <TabsList className="h-full justify-start">
                        {names.map((name) => (
                            <TabsTrigger key={name} value={name}>
                                {name}
                            </TabsTrigger>
                        ))}
                    </TabsList>
                    <ScrollBar orientation="horizontal" className="hidden" />
                </ScrollArea>
            </Card>
        </Tabs>
    )
}
