import { Card } from "@itsmapleleaf/radix-themes"
import { Link } from "@remix-run/react"
import type { ReactNode } from "react"
import type { AuthUser } from "~/auth/auth.server.ts"
import { ProfileButton } from "~/components/profileButton.tsx"

export function Layout({
    user,
    title,
    left,
    right,
    center,
}: {
    user: AuthUser | null
    title: string
    left?: ReactNode
    right?: ReactNode
    center?: ReactNode
}) {
    return (
        <div className="flex w-full flex-col gap-3 p-4">
            <div className="flex items-center gap-3">
                <Card asChild className="bg-[var(--accent-8)] text-zinc-800">
                    <Link to="/">
                        <strong>figrid</strong>
                    </Link>
                </Card>
                <Card asChild>
                    <h1 className="flex-1 items-center justify-center text-center">
                        <span className="pr-8">&nbsp;{title}&nbsp;</span>
                    </h1>
                </Card>
                <ProfileButton user={user} />
            </div>
            <main>
                <div className="grid w-full grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
                    <div className="grow-1 h-[calc(100vh-6rem)] w-full lg:order-2">
                        {center}
                    </div>
                    <div className="h-[calc(100vh-6rem)] w-full md:order-3 md:col-span-2 lg:order-1 lg:col-span-1">
                        {left}
                    </div>
                    <div className="grow-1 h-[calc(100vh-6rem)] w-full md:order-2 lg:order-3">
                        {right}
                    </div>
                </div>
            </main>
        </div>
    )
}
