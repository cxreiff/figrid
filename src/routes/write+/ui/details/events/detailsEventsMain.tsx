import { useSuperRouteLoaderData } from "~/lib/superjson.ts"
import type { WriteEventQuery } from "~/routes/write+/lib/queries.server.ts"
import { type loader as childLoader } from "~/routes/write+/$gridId+/$resourceType+/$resourceId+/_index.tsx"
import { useFetcher } from "@remix-run/react"
import { withZod } from "@remix-validated-form/with-zod"
import { z } from "zod"
import { ValidatedForm } from "remix-validated-form"
import { ValidatedInput } from "~/ui/validated/validatedInput.tsx"
import { ValidatedButton } from "~/ui/validated/validatedButton.tsx"
import { FileIcon, ResetIcon } from "@radix-ui/react-icons"

const formSchema = withZod(
    z.object({
        trigger: z.string().min(1, { message: "trigger is required" }).nullish(),
    }),
)

export function DetailsEventsMain() {
    const resource = useSuperRouteLoaderData<typeof childLoader>(
        "routes/write+/$gridId+/$resourceType+/$resourceId+/_index",
    )?.resource as WriteEventQuery

    const fetcher = useFetcher()
    const trigger = fetcher.formData
        ? fetcher.formData.get("trigger")?.toString() || resource.trigger
        : resource.trigger

    return (
        <ValidatedForm
            validator={formSchema}
            action={`events/${resource.id}/update`}
            method="POST"
            navigate={false}
            autoComplete="off"
            className="h-full flex gap-2 mb-4"
            defaultValues={{ trigger }}
        >
            <ValidatedInput className="flex-1 [&>input]:m-0" id="trigger" label="trigger" noAutocomplete />
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

