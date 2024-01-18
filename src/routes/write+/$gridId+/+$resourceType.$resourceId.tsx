import { z } from "zod"
import { type ActionFunctionArgs, type LoaderFunctionArgs } from "@vercel/remix"
import { and, eq } from "drizzle-orm"
import { db } from "~/database/database.server.ts"
import { paramsSchema as parentParamsSchema } from "~/routes/write+/+$gridId.tsx"
import { characters } from "~/database/schema/characters.server.ts"
import { events } from "~/database/schema/events.server.ts"
import { superjson, useSuperLoaderData } from "~/lib/superjson.ts"
import { useFetcher, useParams } from "@remix-run/react"
import { LayoutTitled } from "~/components/layout/layoutTitled.tsx"
import { FileIcon, ResetIcon } from "@radix-ui/react-icons"
import { ValidatedInput } from "~/components/validated/validatedInput.tsx"
import { ValidatedTextArea } from "~/components/validated/validatedTextArea.tsx"
import { ValidatedForm, validationError } from "remix-validated-form"
import { withZod } from "@remix-validated-form/with-zod"
import { ValidatedButton } from "~/components/validated/validatedButton.tsx"
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
import { auth } from "~/auth/auth.server.ts"
import { ResourcePlaceholder } from "~/routes/write+/resourcePlaceholder.tsx"

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

export async function loader({ request, params }: LoaderFunctionArgs) {
    const user = await auth.isAuthenticated(request, {
        failureRedirect: "/auth/login",
    })

    const { gridId, resourceType, resourceId } = paramsSchema
        .merge(parentParamsSchema)
        .parse(params)

    let resource
    switch (resourceType) {
        case "tiles":
            resource = await writeTileQuery(user.id, gridId, resourceId)
            break
        case "characters":
            resource = await writeCharacterQuery(user.id, gridId, resourceId)
            break
        case "items":
            resource = await writeItemQuery(user.id, gridId, resourceId)
            break
        case "events":
            resource = await writeEventQuery(user.id, gridId, resourceId)
            break
        case "gates":
            resource = await writeGateQuery(user.id, gridId, resourceId)
            break
        case "locks":
            resource = await writeLockQuery(user.id, gridId, resourceId)
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
    const user = await auth.isAuthenticated(request, {
        failureRedirect: "/auth/login",
    })

    const { gridId, resourceType, resourceId } = paramsSchema
        .merge(parentParamsSchema)
        .parse(params)

    const data = await formSchema.validate(await request.formData())

    if (data.error) {
        return validationError(data.error)
    }

    switch (resourceType) {
        case "tiles":
            return db
                .update(tiles)
                .set(data.data)
                .where(
                    and(
                        eq(tiles.user_id, user.id),
                        eq(tiles.grid_id, gridId),
                        eq(tiles.id, resourceId),
                    ),
                )
        case "characters":
            return db
                .update(characters)
                .set(data.data)
                .where(
                    and(
                        eq(characters.user_id, user.id),
                        eq(characters.grid_id, gridId),
                        eq(characters.id, resourceId),
                    ),
                )
        case "items":
            return db
                .update(items)
                .set(data.data)
                .where(
                    and(
                        eq(items.user_id, user.id),
                        eq(items.grid_id, gridId),
                        eq(items.id, resourceId),
                    ),
                )
        case "events":
            return db
                .update(events)
                .set(data.data)
                .where(
                    and(
                        eq(items.user_id, user.id),
                        eq(events.grid_id, gridId),
                        eq(events.id, resourceId),
                    ),
                )
        case "locks":
            return db
                .update(locks)
                .set(data.data)
                .where(
                    and(
                        eq(items.user_id, user.id),
                        eq(locks.grid_id, gridId),
                        eq(locks.id, resourceId),
                    ),
                )
    }
}

export default function Route() {
    const { resource } = useSuperLoaderData<typeof loader>()
    const { resourceType, resourceId } = paramsSchema.parse(useParams())

    const [deleteModalOpen, setDeleteModalOpen] = useState(false)
    const fetcher = useFetcher()

    if (resourceType === "gates") {
        return (
            <Card className="h-full p-4">
                <ResourcePlaceholder>gate fields are fixed</ResourcePlaceholder>
            </Card>
        )
    }

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
