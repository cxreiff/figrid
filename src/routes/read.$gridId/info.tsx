import { ScrollArea, Table, Tabs } from "@itsmapleleaf/radix-themes"

import kitty from "~/../resources/kitty.png"
import { Card } from "~/components/card.tsx"

export function Info() {
    return (
        <Card className="h-full bg-transparent">
            <Tabs.Root defaultValue="tile" className="h-full">
                <Tabs.Content value="tile" className="h-[calc(100%-3rem)] p-6">
                    <img
                        src={kitty}
                        alt="placeholder"
                        className="pixel-image m-auto h-1/2 object-contain"
                    />
                    <ScrollArea className="h-1/2">
                        <Table.Root className="pb-6">
                            <Table.Body>
                                <Table.Row>
                                    <Table.RowHeaderCell>
                                        placeholder item 1
                                    </Table.RowHeaderCell>
                                    <Table.Cell>a placeholder item</Table.Cell>
                                    <Table.Cell>2g</Table.Cell>
                                </Table.Row>

                                <Table.Row>
                                    <Table.RowHeaderCell>
                                        placeholder item 2
                                    </Table.RowHeaderCell>
                                    <Table.Cell>
                                        another placeholder item
                                    </Table.Cell>
                                    <Table.Cell>3g</Table.Cell>
                                </Table.Row>

                                <Table.Row>
                                    <Table.RowHeaderCell>
                                        placeholder item 3
                                    </Table.RowHeaderCell>
                                    <Table.Cell>
                                        a third placeholder item
                                    </Table.Cell>
                                    <Table.Cell>4g</Table.Cell>
                                </Table.Row>
                            </Table.Body>
                        </Table.Root>
                        <Table.Root>
                            <Table.Body>
                                <Table.Row>
                                    <Table.RowHeaderCell>
                                        placeholder item 1
                                    </Table.RowHeaderCell>
                                    <Table.Cell>a placeholder item</Table.Cell>
                                    <Table.Cell>2g</Table.Cell>
                                </Table.Row>

                                <Table.Row>
                                    <Table.RowHeaderCell>
                                        placeholder item 2
                                    </Table.RowHeaderCell>
                                    <Table.Cell>
                                        another placeholder item
                                    </Table.Cell>
                                    <Table.Cell>3g</Table.Cell>
                                </Table.Row>

                                <Table.Row>
                                    <Table.RowHeaderCell>
                                        placeholder item 3
                                    </Table.RowHeaderCell>
                                    <Table.Cell>
                                        a third placeholder item
                                    </Table.Cell>
                                    <Table.Cell>4g</Table.Cell>
                                </Table.Row>
                            </Table.Body>
                        </Table.Root>
                    </ScrollArea>
                </Tabs.Content>

                <Tabs.Content value="status" className="h-[calc(100%-3rem)]">
                    Empty
                </Tabs.Content>

                <Tabs.Content value="data" className="h-[calc(100%-3rem)]">
                    Empty
                </Tabs.Content>
                <Tabs.List className="absolute bottom-0 mx-4 mt-6 h-10 shadow-none">
                    <Tabs.Trigger value="tile" className="cursor-pointer">
                        tile
                    </Tabs.Trigger>
                    <Tabs.Trigger value="status" className="cursor-pointer">
                        status
                    </Tabs.Trigger>
                    <Tabs.Trigger value="data" className="cursor-pointer">
                        data
                    </Tabs.Trigger>
                </Tabs.List>
            </Tabs.Root>
        </Card>
    )
}
