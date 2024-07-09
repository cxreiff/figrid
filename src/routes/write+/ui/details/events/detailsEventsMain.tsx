import { useSuperRouteLoaderData } from "~/lib/superjson.ts"
import type { WriteEventQuery } from "~/routes/write+/lib/queries.server.ts"
import { type loader as childLoader } from "~/routes/write+/$gridId+/$resourceType+/$resourceId+/_index.tsx"
import { withZod } from "@remix-validated-form/with-zod"
import { z } from "zod"
import { ValidatedForm } from "remix-validated-form"
import { ValidatedInput } from "~/ui/validated/validatedInput.tsx"
import { ValidatedButton } from "~/ui/validated/validatedButton.tsx"
import { FileIcon, ResetIcon } from "@radix-ui/react-icons"

const formSchema = withZod(
    z.object({
        trigger: z
            .string()
            .min(1, { message: "trigger is required" })
            .nullish(),
    }),
)

export function DetailsEventsMain() {
    const resource = useSuperRouteLoaderData<typeof childLoader>(
        "routes/write+/$gridId+/$resourceType+/$resourceId+/_index",
    )?.resource as WriteEventQuery

    return resource.parent_id == null ? (
        <p className="ml-2 text-muted">root event</p>
    ) : (
        <ValidatedForm
            key={resource.id}
            validator={formSchema}
            action={`events/${resource.id}/update`}
            method="POST"
            autoComplete="off"
            className="mb-4 flex h-full gap-2"
            defaultValues={{ trigger: resource.trigger }}
        >
            <ValidatedInput
                className="flex-1 [&>input]:m-0"
                id="trigger"
                label="trigger"
                noAutocomplete
            />
            <ValidatedButton
                type="reset"
                variant="outline"
                icon={ResetIcon}
                className="self-end"
            />
            <ValidatedButton
                type="submit"
                variant="outline"
                icon={FileIcon}
                className="self-end"
            />
        </ValidatedForm>
    )
}
