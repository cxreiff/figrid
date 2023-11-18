import { Form, useLoaderData, useNavigate } from "@remix-run/react";
import { json, type LoaderFunctionArgs } from "@vercel/remix";
import { TextTyper } from "~/components/text-typer";
import { db } from "~/database/db.server";
import invariant from "tiny-invariant";
import { eq } from "drizzle-orm";
import { rooms } from "~/database/schema.server";
import { useState } from "react";

export const config = { runtime: "edge" };

export async function loader({ params }: LoaderFunctionArgs) {
    invariant(params.id, "missing id param");
    const room = await db.query.rooms.findFirst({
        where: eq(rooms.id, Number(params.id)),
    });
    if (!room) {
        throw new Response("not Found", { status: 404 });
    }
    return json({ room });
}

export default function Index() {
    const navigate = useNavigate();
    const { room } = useLoaderData<typeof loader>();
    const [cmd, setCmd] = useState("");

    return (
        <>
            <TextTyper
                className="text-center"
                text={`${room.description || "[empty description]"
                    }\n\nthere are exits to the ${[
                        room.north && "north",
                        room.east && "east",
                        room.south && "south",
                        room.west && "west",
                    ]
                        .filter((dir) => dir != undefined)
                        .join(", ")}.\n\n`}
            />
            <Form
                navigate={false}
                onSubmit={() => {
                    setCmd("");
                    switch (cmd) {
                        case "north":
                            room.north && navigate(`/room/${room.north.toString()}`);
                            break;
                        case "east":
                            room.east && navigate(`/room/${room.east.toString()}`);
                            break;
                        case "south":
                            room.south && navigate(`/room/${room.south.toString()}`);
                            break;
                        case "west":
                            room.west && navigate(`/room/${room.west.toString()}`);
                            break;
                    }
                }}
            >
                {">"}
                <input
                    name="cmd"
                    value={cmd}
                    onChange={({ target }) => setCmd(target.value)}
                    className="border-b-2 border-stone-200 bg-transparent p-2 caret-stone-200 outline-none"
                />
            </Form>
        </>
    );
}
