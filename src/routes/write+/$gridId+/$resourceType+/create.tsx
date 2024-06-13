import { z } from "zod"
import {
    redirect,
    type ActionFunctionArgs,
    type LoaderFunctionArgs,
} from "@vercel/remix"
import { db } from "~/database/database.server.ts"
import { paramsSchema as parentParamsSchema } from "~/routes/write+/$gridId+/_route.tsx"
import { characters } from "~/database/schema/characters.server.ts"
import { events } from "~/database/schema/events.server.ts"
import { useNavigate, useParams } from "@remix-run/react"
import { LayoutTitled } from "~/ui/layout/layoutTitled.tsx"
import { Cross2Icon, FileIcon, ResetIcon } from "@radix-ui/react-icons"
import { ValidatedInput } from "~/ui/validated/validatedInput.tsx"
import { ValidatedTextArea } from "~/ui/validated/validatedTextArea.tsx"
import { ValidatedForm, validationError } from "remix-validated-form"
import { withZod } from "@remix-validated-form/with-zod"
import { ValidatedButton } from "~/ui/validated/validatedButton.tsx"
import { auth } from "~/auth/auth.server.ts"
import { eq } from "drizzle-orm"
import { superjson, useSuperLoaderData } from "~/lib/superjson.ts"
import { tiles } from "~/database/schema/tiles.server.ts"
import { items } from "~/database/schema/items.server.ts"
import { locks } from "~/database/schema/locks.server.ts"
import { Card } from "~/ui/primitives/card.tsx"
import {
    linkTile,
    parseNeighbors,
} from "~/routes/write+/lib/linkTile.server.ts"

export const paramsSchema = z.object({
    resourceType: z.enum(["tiles", "characters", "items", "events", "locks"]),
})

export const formSchema = withZod(
    z.object({
        name: z.string().min(1, { message: "name is required" }),
        summary: z.string(),
        description: z.string(),
    }),
)

export async function loader({ request, params }: LoaderFunctionArgs) {
    const { resourceType } = paramsSchema.parse(params)
    const duplicate = z.coerce
        .number()
        .optional()
        .parse(new URL(request.url).searchParams.get("duplicate"))

    let resource
    if (duplicate) {
        switch (resourceType) {
            case "tiles":
                resource = await db.query.tiles.findFirst({
                    where: eq(tiles.id, duplicate),
                })
                break
            case "characters":
                resource = await db.query.characters.findFirst({
                    where: eq(characters.id, duplicate),
                })
                break
            case "items":
                resource = await db.query.items.findFirst({
                    where: eq(items.id, duplicate),
                })
                break
            case "events":
                resource = await db.query.events.findFirst({
                    where: eq(events.id, duplicate),
                })
            case "locks":
                resource = await db.query.events.findFirst({
                    where: eq(locks.id, duplicate),
                })
                break
        }
    }

    return superjson({ resource })
}

export async function action({ request, params }: ActionFunctionArgs) {
    const { gridId, resourceType } = parentParamsSchema
        .merge(paramsSchema)
        .parse(params)

    const user = await auth.isAuthenticated(request)

    if (!user) {
        return redirect("/auth/login")
    }

    const data = await formSchema.validate(await request.formData())

    if (data.error) {
        return validationError(data.error)
    }

    let insertId
    switch (resourceType) {
        case "tiles":
            ;[{ insertId }] = await db
                .insert(tiles)
                .values({ ...data.data, grid_id: gridId, user_id: user.id })
                .returning({ insertId: tiles.id })

            const neighbors = parseNeighbors(request.url)
            if (neighbors.length > 0) {
                await linkTile(user, neighbors, gridId, Number(insertId))
            }

            break
        case "characters":
            ;[{ insertId }] = await db
                .insert(characters)
                .values({ ...data.data, grid_id: gridId, user_id: user.id })
                .returning({ insertId: tiles.id })
            break
        case "items":
            ;[{ insertId }] = await db
                .insert(items)
                .values({ ...data.data, grid_id: gridId, user_id: user.id })
                .returning({ insertId: tiles.id })
            break
        case "events":
            ;[{ insertId }] = await db
                .insert(events)
                .values({ ...data.data, grid_id: gridId, user_id: user.id })
                .returning({ insertId: tiles.id })

            break
        case "locks":
            ;[{ insertId }] = await db
                .insert(locks)
                .values({ ...data.data, grid_id: gridId, user_id: user.id })
                .returning({ insertId: tiles.id })
    }

    return redirect(`/write/${gridId}/${resourceType}/${insertId}`)
}

export default function Route() {
    const { gridId, resourceType } = parentParamsSchema
        .merge(paramsSchema)
        .parse(useParams())
    const { resource } = useSuperLoaderData<typeof loader>()

    const navigate = useNavigate()

    return (
        <Card className="h-full p-4">
            <ValidatedForm
                key={resourceType}
                validator={formSchema}
                defaultValues={
                    resource && {
                        name: `${resource.name} duplicate`,
                        summary: resource.summary || "",
                        description: resource.description || "",
                    }
                }
                method="POST"
                autoComplete="off"
                className="h-full"
            >
                <LayoutTitled
                    footerSlot={
                        <div className="flex gap-4">
                            <ValidatedButton
                                variant="outline"
                                icon={Cross2Icon}
                                className="flex-1"
                                onClick={() =>
                                    resource
                                        ? navigate(
                                              `/write/${gridId}/${resourceType}/${resource.id}`,
                                          )
                                        : navigate(`/write/${gridId}`)
                                }
                            >
                                cancel
                            </ValidatedButton>
                            <ValidatedButton
                                type="reset"
                                variant="outline"
                                icon={ResetIcon}
                                className="flex-1"
                            >
                                revert
                            </ValidatedButton>
                            <ValidatedButton
                                type="submit"
                                variant="outline"
                                icon={FileIcon}
                                className="w-1/3"
                            >
                                create{" "}
                                {
                                    {
                                        tiles: "tile",
                                        characters: "character",
                                        items: "item",
                                        events: "event",
                                        locks: "lock",
                                    }[resourceType]
                                }
                            </ValidatedButton>
                        </div>
                    }
                >
                    <ValidatedInput id="name" label="name" noAutocomplete />
                    <ValidatedInput
                        id="summary"
                        label="summary"
                        noAutocomplete
                    />
                    <ValidatedTextArea
                        className="h-[calc(100%-11.75rem)] [&>textarea]:h-full [&>textarea]:resize-none"
                        id="description"
                        label="description"
                        noAutocomplete
                    />
                </LayoutTitled>
            </ValidatedForm>
        </Card>
    )
}
