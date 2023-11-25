import { Form, useLoaderData } from "@remix-run/react"
import {
  type ActionFunctionArgs,
  json,
  type LoaderFunctionArgs,
  redirect,
} from "@vercel/remix"
import { TextTyper } from "~/components/text-typer"
import { db } from "~/utilities/database.server"
import invariant from "tiny-invariant"
import { eq } from "drizzle-orm"
import { rooms, room_select_schema } from "~/utilities/schema.server"
import { z } from "zod"

export const config = { runtime: "edge" }

export async function loader({ params }: LoaderFunctionArgs) {
  invariant(params.id, "missing id param")
  const [room] = await db
    .select()
    .from(rooms)
    .where(eq(rooms.id, Number(params.id)))
    .limit(1)
  if (!room) {
    throw new Response("Not Found", { status: 404 })
  }
  return json({ room })
}

const action_schema = z.object({
  cmd: z.string(),
  room: z.preprocess((r) => JSON.parse(String(r)), room_select_schema),
})

export async function action({ request }: ActionFunctionArgs) {
  const data = Object.fromEntries(await request.formData())
  const { cmd, room } = action_schema.parse(data)

  switch (cmd) {
    case "north":
      return room.north
        ? redirect(`/room/${room.north}`)
        : new Response("invalid direction")
    case "east":
      return room.east
        ? redirect(`/room/${room.east}`)
        : new Response("invalid direction")
    case "south":
      return room.south
        ? redirect(`/room/${room.south}`)
        : new Response("invalid direction")
    case "west":
      return room.west
        ? redirect(`/room/${room.west}`)
        : new Response("invalid direction")
    default:
      return new Response("invalid cmd")
  }
}

export default function Room() {
  const { room } = useLoaderData<typeof loader>()

  return (
    <div key={room.id} className="p-12 text-center">
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
      <Form method="post" replace preventScrollReset>
        {">"}
        <input
          name="cmd"
          className="border-b-2 border-stone-200 bg-transparent p-2 caret-stone-200 outline-none"
          autoFocus
        />
        <input name="room" defaultValue={JSON.stringify(room)} hidden />
        <input type="submit" hidden />
      </Form>
    </div>
  )
}
