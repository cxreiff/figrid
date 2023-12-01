import { Card, Flex, TextField } from "@itsmapleleaf/radix-themes";
import { ChevronRightIcon } from "@radix-ui/react-icons";
import { Form } from "@remix-run/react";
import { useRef } from "react";
import { TextTyper } from "~/components/textTyper.tsx";
import type { TilesSelectModel } from "~/database/schema/grids.server.ts";

export function Text({ tile }: { tile: TilesSelectModel }) {
    const inputRef = useRef<HTMLInputElement>(null)

    return (
        <Flex key={tile.id} direction="column" gap="5" onClick={() => inputRef.current?.focus()}>
            <Card key={tile.id} className="p-0" style={{ height: "calc(100vh - 10rem)" }}>
                <TextTyper
                    text={`${tile.description || "[empty description]"
                        }\n\nthere are exits to the ${[
                            tile.north_id && "north",
                            tile.east_id && "east",
                            tile.south_id && "south",
                            tile.west_id && "west",
                        ]
                            .filter((dir) => dir != undefined)
                            .join(", ")}.`}
                />
            </Card>
            <Form method="post" replace preventScrollReset>
                <TextField.Root>
                    <TextField.Slot>
                        <ChevronRightIcon />
                    </TextField.Slot>
                    <TextField.Input key={tile.id} ref={inputRef} name="cmd" autoFocus />
                </TextField.Root>
                <input name="tile" defaultValue={JSON.stringify(tile)} hidden />
                <input type="submit" hidden />
            </Form>
        </Flex>
    )
}
