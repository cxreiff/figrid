import { MixIcon, ReaderIcon, Share2Icon } from "@radix-ui/react-icons"
import { Card } from "~/ui/primitives/card.tsx"

export function SiteDescription() {
    const step1 = (
        <>
            <ReaderIcon className="mr-3 h-6 w-6 min-w-6" />
            <p className="min-w-0 sm:text-center">add writing and images</p>
        </>
    )

    const step2 = (
        <>
            <MixIcon className="mr-3 h-6 w-6 min-w-6" />
            <p className="min-w-0 sm:text-center">add interactivity</p>
        </>
    )

    const step3 = (
        <>
            <Share2Icon className="mr-3 h-6 w-6 min-w-6" />
            <p className="min-w-0 sm:text-center">host and share</p>
        </>
    )

    return (
        <div className="flex min-h-0 max-w-full items-center gap-3 [&>*>*]:skew-x-3 [&>*]:-skew-x-3">
            <h3 className="flex h-full flex-col justify-center rounded-sm bg-primary-foreground p-3 font-mono text-lg font-bold text-background">
                <div>welcome</div>
                <div className="whitespace-nowrap">to figrid</div>
            </h3>
            <Card className="flex h-full flex-1 flex-col items-center justify-center gap-3 bg-background p-4 sm:hidden">
                <div className="flex w-full">{step1}</div>
                <div className="flex w-full">{step2}</div>
                <div className="flex w-full">{step3}</div>
            </Card>
            <Card className="hidden h-full flex-1 flex-col items-center justify-center gap-2 bg-background p-2 sm:flex">
                {step1}
            </Card>
            <Card className="hidden h-full flex-1 flex-col items-center justify-center gap-2 bg-background p-2 sm:flex">
                {step2}
            </Card>
            <Card className="hidden h-full flex-1 flex-col items-center justify-center gap-2 bg-background p-2 sm:flex">
                {step3}
            </Card>
        </div>
    )
}
