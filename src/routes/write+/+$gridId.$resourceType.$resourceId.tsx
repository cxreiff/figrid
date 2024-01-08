import { z } from "zod"
import { type ActionFunctionArgs, type LoaderFunctionArgs } from "@vercel/remix"
import { and, eq } from "drizzle-orm"
import { db } from "~/database/database.server.ts"
import { tiles } from "~/database/schema/grids.server.ts"
import { paramsSchema as parentParamsSchema } from "~/routes/write+/+$gridId.tsx"
import { characters, items } from "~/database/schema/entities.server.ts"
import { events } from "~/database/schema/events.server.ts"
import { superjson, useSuperLoaderData } from "~/lib/superjson.ts"
import { useFetcher, useNavigate, useParams } from "@remix-run/react"
import { LayoutTitled } from "~/components/layoutTitled.tsx"
import { CopyIcon, FileIcon, ResetIcon, TrashIcon } from "@radix-ui/react-icons"
import { ValidatedInput } from "~/components/validatedInput.tsx"
import { ValidatedTextArea } from "~/components/validatedTextArea.tsx"
import { ValidatedForm, validationError } from "remix-validated-form"
import { withZod } from "@remix-validated-form/with-zod"
import { ValidatedButton } from "~/components/validatedButton.tsx"
import { DeleteResourceDialog } from "~/components/deleteResourceDialog.tsx"
import { useState } from "react"

export const paramsSchema = z.object({
    resourceType: z.enum(["tiles", "characters", "items", "events"]),
    resourceId: z.coerce.number(),
})

export const formSchema = withZod(
    z.object({
        name: z.string().min(1, { message: "name is required" }),
        summary: z.string(),
        description: z.string(),
    }),
)

export async function loader({ params }: LoaderFunctionArgs) {
    const { resourceType, resourceId } = paramsSchema.parse(params)

    let resource
    switch (resourceType) {
        case "tiles":
            resource = await db.query.tiles.findFirst({
                where: eq(tiles.id, resourceId),
            })
            break
        case "characters":
            resource = await db.query.characters.findFirst({
                where: eq(characters.id, resourceId),
            })
            break
        case "items":
            resource = await db.query.items.findFirst({
                where: eq(items.id, resourceId),
            })
            break
        case "events":
            resource = await db.query.events.findFirst({
                where: eq(events.id, resourceId),
            })
            break
    }

    if (!resource) {
        throw new Response(null, {
            status: 404,
            statusText: "not found",
        })
    }

    return superjson({ resource })
}

export async function action({ request, params }: ActionFunctionArgs) {
    const { gridId, resourceType, resourceId } = parentParamsSchema
        .merge(paramsSchema)
        .parse(params)

    const data = await formSchema.validate(await request.formData())

    if (data.error) {
        return validationError(data.error)
    }

    switch (resourceType) {
        case "tiles":
            return await db
                .update(tiles)
                .set(data.data)
                .where(and(eq(tiles.id, resourceId), eq(tiles.grid_id, gridId)))
        case "characters":
            return await db
                .update(characters)
                .set(data.data)
                .where(
                    and(
                        eq(characters.id, resourceId),
                        eq(characters.grid_id, gridId),
                    ),
                )
        case "items":
            return await db
                .update(items)
                .set(data.data)
                .where(and(eq(items.id, resourceId), eq(items.grid_id, gridId)))
        case "events":
            return await db
                .update(events)
                .set(data.data)
                .where(
                    and(eq(events.id, resourceId), eq(events.grid_id, gridId)),
                )
    }
}

export default function Route() {
    const { resource } = useSuperLoaderData<typeof loader>()
    const { gridId, resourceType, resourceId } = paramsSchema
        .merge(parentParamsSchema)
        .parse(useParams())
    const navigate = useNavigate()

    const [deleteModalOpen, setDeleteModalOpen] = useState(false)
    const fetcher = useFetcher()

    return (
        <ValidatedForm
            key={`${resourceId}.${resourceType}`}
            validator={formSchema}
            defaultValues={{
                name: resource.name,
                summary: resource.summary || "",
                description: resource.description || "",
            }}
            method="POST"
            autoComplete="off"
            className="h-full"
        >
            <LayoutTitled
                footerSlot={
                    <div className="flex gap-4">
                        <ValidatedButton
                            icon={TrashIcon}
                            variant="outline"
                            onClick={() => setDeleteModalOpen(true)}
                        />
                        <ValidatedButton
                            variant="outline"
                            icon={CopyIcon}
                            className="flex-1"
                            onClick={() =>
                                navigate(
                                    `/write/${gridId}/${resourceType}/create?duplicate=${resourceId}`,
                                )
                            }
                        >
                            duplicate
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
                            className="flex-1"
                        >
                            save
                        </ValidatedButton>
                        <DeleteResourceDialog
                            open={deleteModalOpen}
                            onOpenChange={setDeleteModalOpen}
                            onConfirm={() =>
                                fetcher.submit(null, {
                                    action: `delete`,
                                    method: "POST",
                                })
                            }
                        />
                    </div>
                }
            >
                <ValidatedInput id="name" label="name" noAutocomplete />
                <ValidatedInput id="summary" label="summary" noAutocomplete />
                <ValidatedTextArea
                    className="h-[calc(100%-11.75rem)] [&>textarea]:h-full [&>textarea]:resize-none"
                    id="description"
                    label="description"
                    noAutocomplete
                />
            </LayoutTitled>
        </ValidatedForm>
    )
}
