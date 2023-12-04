import { Table, Tabs } from "@itsmapleleaf/radix-themes"

import kitty from "~/../resources/kitty.png"

export function Info() {
    return (
        <div className="h-full rounded-lg border border-zinc-600">
            <Tabs.Root defaultValue="tile" className="h-full">
                <Tabs.Content value="tile" className="h-[calc(100%-4rem)] p-4">
                    <img
                        src={kitty}
                        alt="placeholder"
                        className="pixel-image m-auto h-1/2 object-contain"
                    />
                    <Table.Root className="h-1/2">
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
                </Tabs.Content>

                <Tabs.Content
                    value="status"
                    className="h-[calc(100%-4rem)] p-4"
                >
                    Empty
                </Tabs.Content>

                <Tabs.Content value="data" className="h-[calc(100%-4rem)] p-4">
                    Empty
                </Tabs.Content>
                <Tabs.List className="mx-4 mt-6 h-10 shadow-none">
                    <Tabs.Trigger value="tile">tile</Tabs.Trigger>
                    <Tabs.Trigger value="status">status</Tabs.Trigger>
                    <Tabs.Trigger value="data">data</Tabs.Trigger>
                </Tabs.List>
            </Tabs.Root>
        </div>
    )
}
