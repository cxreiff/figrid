import { DetailsResourceCard } from "~/routes/write+/ui/details/detailsResourceCard.tsx"

export function DetailsLabeledCard<
    T extends { id: number; name: string; type?: string },
>({
    label,
    resource,
    navigateUrl,
}: {
    label: string
    resource: T
    navigateUrl: string
}) {
    return (
        <div>
            <h3 className="items-center px-2 py-4 text-sm font-medium text-muted-foreground">
                {label}
            </h3>
            <DetailsResourceCard
                linkedResource={resource}
                navigateUrl={navigateUrl}
            />
        </div>
    )
}
