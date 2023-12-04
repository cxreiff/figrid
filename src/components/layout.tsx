import { Card } from "@itsmapleleaf/radix-themes"
import { DotFilledIcon } from "@radix-ui/react-icons"
import { Link } from "@remix-run/react"
import type { ReactNode } from "react"
import type { AuthUser } from "~/auth/auth.server.ts"
import { ProfileButton } from "~/components/profileButton.tsx"

export function Layout({
    user,
    title,
    subtitle,
    left,
    right,
    center,
}: {
    user: AuthUser | null
    title: string
    subtitle?: string | null
    left?: ReactNode
    right?: ReactNode
    center?: ReactNode
}) {
    return (
        <div className="flex w-full flex-col gap-3 p-4">
            <div className="flex items-center gap-3">
                <Card
                    className="bg-[var(--accent-8)] p-0 text-black mix-blend-screen"
                    asChild
                >
                    <Link to="/">
                        <strong>figrid</strong>
                    </Link>
                </Card>
                <Card className="flex-1 bg-transparent text-center">
                    <h1 className="flex items-center justify-center">
                        <span className="pr-8">{title}</span>
                        {subtitle && <DotFilledIcon />}
                        {subtitle && <span className="pl-8">{subtitle}</span>}
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
