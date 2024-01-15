import { z } from "zod"
import { type ActionFunctionArgs, type LoaderFunctionArgs } from "@vercel/remix"
import { and, eq } from "drizzle-orm"
import { db } from "~/database/database.server.ts"
import { paramsSchema as parentParamsSchema } from "~/routes/write+/+$gridId.tsx"
import { characters } from "~/database/schema/characters.server.ts"
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
import {
    writeCharacterQuery,
    writeEventQuery,
    writeGateQuery,
    writeItemQuery,
    writeLockQuery,
    writeTileQuery,
} from "~/routes/write+/queries.server.ts"
import { items } from "~/database/schema/items.server.ts"
import { tiles } from "~/database/schema/tiles.server.ts"
import { locks } from "~/database/schema/locks.server.ts"
import { Card } from "~/components/ui/card.tsx"

export const paramsSchema = z.object({
    resourceType: z.enum([
        "tiles",
        "characters",
        "items",
        "events",
        "gates",
        "locks",
    ]),
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
            resource = await writeTileQuery(resourceId)
            break
        case "characters":
            resource = await writeCharacterQuery(resourceId)
            break
        case "items":
            resource = await writeItemQuery(resourceId)
            break
        case "events":
            resource = await writeEventQuery(resourceId)
            break
        case "gates":
            resource = await writeGateQuery(resourceId)
            break
        case "locks":
            resource = await writeLockQuery(resourceId)
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
    const { gridId, resourceType, resourceId } = paramsSchema
        .merge(parentParamsSchema)
        .parse(params)

    const data = await formSchema.validate(await request.formData())

    if (data.error) {
        return validationError(data.error)
    }

    let response
    switch (resourceType) {
        case "tiles":
            response = await db
                .update(tiles)
                .set(data.data)
                .where(and(eq(tiles.grid_id, gridId), eq(tiles.id, resourceId)))
        case "characters":
            response = await db
                .update(characters)
                .set(data.data)
                .where(
                    and(
                        eq(characters.grid_id, gridId),
                        eq(characters.id, resourceId),
                    ),
                )
        case "items":
            response = await db
                .update(items)
                .set(data.data)
                .where(and(eq(items.grid_id, gridId), eq(items.id, resourceId)))
        case "events":
            response = await db
                .update(events)
                .set(data.data)
                .where(
                    and(eq(events.grid_id, gridId), eq(events.id, resourceId)),
                )
        case "locks":
            response = await db
                .update(locks)
                .set(data.data)
                .where(and(eq(locks.grid_id, gridId), eq(locks.id, resourceId)))
    }

    return response
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
        <Card className="h-full p-4">
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
                            {resourceType !== "gates" && (
                                <ValidatedButton
                                    icon={TrashIcon}
                                    variant="outline"
                                    onClick={() => setDeleteModalOpen(true)}
                                />
                            )}
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
