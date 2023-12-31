import { Link } from "@remix-run/react"
import type { ReactNode } from "react"
import type { AuthUser } from "~/auth/auth.server.ts"
import { ProfileButton } from "~/components/profileButton.tsx"
import { ThemeToggle } from "~/components/themeToggle.tsx"

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
        <div className="relative h-screen w-full gap-3 p-4">
            <div className="absolute inset-x-4 top-0 flex h-16 items-center">
                <Link to="/">
                    <strong className="text-accent-foreground">figrid</strong>
                </Link>
                <hr className="mx-3 flex-1" />
                <h1 className="p-2">{title}</h1>
                <hr className="mx-3 flex-1" />
                <ThemeToggle />
                <ProfileButton user={user} />
            </div>
            <main className="absolute inset-x-4 bottom-4 top-16 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
                <div className="grow-1 h-[calc(100vh-4rem)] w-full pb-6 lg:order-2">
                    {center}
                </div>
                <div className="h-[calc(100vh-4rem)] w-full pb-6 md:order-3 md:col-span-2 lg:order-1 lg:col-span-1">
                    {left}
                </div>
                <div className="grow-1 h-[calc(100vh-4rem)] w-full pb-6 md:order-2 lg:order-3">
                    {right}
                </div>
            </main>
        </div>
    )
}
