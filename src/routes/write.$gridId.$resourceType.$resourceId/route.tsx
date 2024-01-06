import { z } from "zod"
import { type ActionFunctionArgs, type LoaderFunctionArgs } from "@vercel/remix"
import { and, eq } from "drizzle-orm"
import { db } from "~/database/database.server.ts"
import { tiles } from "~/database/schema/grids.server.ts"
import { paramsSchema as parentParamsSchema } from "~/routes/write.$gridId/route.tsx"
import { characters, items } from "~/database/schema/entities.server.ts"
import { events } from "~/database/schema/events.server.ts"
import { superjson, useSuperLoaderData } from "~/utilities/superjson.ts"
import { useParams } from "@remix-run/react"
import { LayoutTitled } from "~/components/layoutTitled.tsx"
import { CopyIcon, FileIcon, ResetIcon } from "@radix-ui/react-icons"
import { ValidatedInput } from "~/components/validatedInput.tsx"
import { ValidatedTextArea } from "~/components/validatedTextArea.tsx"
import { ValidatedForm, validationError } from "remix-validated-form"
import { withZod } from "@remix-validated-form/with-zod"
import { ValidatedButton } from "~/components/validatedButton.tsx"

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
    const { gridId, resourceId } = parentParamsSchema
        .merge(paramsSchema)
        .parse(params)

    const data = await formSchema.validate(await request.formData())

    if (data.error) {
        return validationError(data.error)
    }

    return await db
        .update(tiles)
        .set(data.data)
        .where(and(eq(tiles.id, resourceId), eq(tiles.grid_id, gridId)))
}

export default function Route() {
    const { resource } = useSuperLoaderData<typeof loader>()
    const { resourceType, resourceId } = paramsSchema.parse(useParams())

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
                            type="reset"
                            variant="outline"
                            icon={ResetIcon}
                            className="flex-1"
                        >
                            revert
                        </ValidatedButton>
                        <ValidatedButton
                            variant="outline"
                            icon={CopyIcon}
                            className="flex-1"
                        >
                            duplicate
                        </ValidatedButton>
                        <ValidatedButton
                            type="submit"
                            variant="outline"
                            icon={FileIcon}
                            className="flex-1"
                        >
                            save
                        </ValidatedButton>
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
