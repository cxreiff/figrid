import { Form, useLoaderData } from "@remix-run/react";
import {
  type ActionFunctionArgs,
  json,
  type LoaderFunctionArgs,
  redirect,
} from "@vercel/remix";
import { TextTyper } from "~/components/text-typer";
import { db } from "~/database/db.server";
import invariant from "tiny-invariant";
import { eq } from "drizzle-orm";
import { rooms, room_schema } from "~/database/schema.server";
import { z } from "zod";

export const config = { runtime: "edge" };

export async function loader({ params }: LoaderFunctionArgs) {
  invariant(params.id, "missing id param");
  const room = await db.query.rooms.findFirst({
    where: eq(rooms.id, Number(params.id)),
  });
  if (!room) {
    throw new Response("Not Found", { status: 404 });
  }
  return json({ room });
}

const action_schema = z.object({
  cmd: z.string(),
  room: z.preprocess((r) => JSON.parse(String(r)), room_schema),
});

export async function action({ request }: ActionFunctionArgs) {
  const data = Object.fromEntries(await request.formData());
  const { cmd, room } = action_schema.parse(data);

  switch (cmd) {
    case "north":
      return redirect(`/room/${room.north}`);
    case "east":
      return redirect(`/room/${room.east}`);
    case "south":
      return redirect(`/room/${room.south}`);
    case "west":
      return redirect(`/room/${room.west}`);
    default:
      return new Response("invalid cmd");
  }
}

export default function Index() {
  const { room } = useLoaderData<typeof loader>();

  return (
    <>
      <TextTyper
        className="pb-8 text-center"
        text={`${
          room.description || "[empty description]"
        }\n\nthere are exits to the ${[
          room.north && "north",
          room.east && "east",
          room.south && "south",
          room.west && "west",
        ]
          .filter((dir) => dir != undefined)
          .join(", ")}.`}
      />
      <Form key={room.id} method="post" replace preventScrollReset>
        {">"}
        <input
          name="cmd"
          className="border-b-2 border-stone-200 bg-transparent p-2 caret-stone-200 outline-none"
          autoFocus
        />
        <input name="room" defaultValue={JSON.stringify(room)} hidden />
        <input type="submit" hidden />
      </Form>
    </>
  );
}
