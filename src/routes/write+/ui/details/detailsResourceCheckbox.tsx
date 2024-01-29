import { useFetcher } from "@remix-run/react"
import { LabeledCheckbox } from "~/components/labeledCheckbox.tsx"

export function DetailsResourceCheckbox<T extends string>({
    field,
    checked,
    updateRoute,
    label,
    description,
}: {
    field: T
    checked: boolean
    updateRoute: string
    label: string
    description?: string
}) {
    const fetcher = useFetcher()
    const optimisticChecked = fetcher.formData
        ? fetcher.formData.get(field) === "true"
        : checked

    return (
        <LabeledCheckbox
            id={field}
            className="px-5 py-3"
            label={label}
            description={description}
            checked={optimisticChecked}
            onCheckedChange={(newChecked) => {
                fetcher.submit(
                    {
                        [field]: newChecked === true,
                    },
                    {
                        action: updateRoute,
                        method: "POST",
                        navigate: true,
                    },
                )
            }}
        />
    )
}
