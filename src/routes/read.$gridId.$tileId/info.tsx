import { Table, Tabs } from "@itsmapleleaf/radix-themes"

import kitty from "~/../resources/kitty.png"

export function Info() {
    return (
        <div className="flex h-full flex-col gap-5">
            <img
                src={kitty}
                alt="placeholder"
                className="pixel-image flex-1 rounded-lg border border-zinc-600 object-contain"
            />
            <Tabs.Root
                defaultValue="tile"
                className="flex min-h-[30%] flex-col rounded-lg border border-zinc-600"
            >
                <Tabs.Content value="tile" className="flex-1 p-4">
                    <Table.Root>
                        <Table.Header>
                            <Table.Row>
                                <Table.ColumnHeaderCell>
                                    item
                                </Table.ColumnHeaderCell>
                                <Table.ColumnHeaderCell>
                                    description
                                </Table.ColumnHeaderCell>
                                <Table.ColumnHeaderCell>
                                    weight
                                </Table.ColumnHeaderCell>
                            </Table.Row>
                        </Table.Header>

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

                <Tabs.Content value="status" className="flex-1 p-4">
                    Empty
                </Tabs.Content>

                <Tabs.Content value="data" className="flex-1 p-4">
                    Empty
                </Tabs.Content>
                <Tabs.List className="mx-2 mt-4">
                    <Tabs.Trigger value="tile">tile</Tabs.Trigger>
                    <Tabs.Trigger value="status">status</Tabs.Trigger>
                    <Tabs.Trigger value="data">data</Tabs.Trigger>
                </Tabs.List>
            </Tabs.Root>
        </div>
    )
}