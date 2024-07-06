import { type ReactNode } from "react"
import type { AuthUser } from "~/auth/auth.server.ts"
import { LayoutTopBar } from "~/ui/layout/layoutTopBar.tsx"

export function Layout({
    children,
    user,
    title,
    iconButtons,
}: {
    children: ReactNode
    user: AuthUser | null
    title?: string
    iconButtons?: ReactNode
}) {
    return (
        <div className="relative h-screen max-h-[-webkit-fill-available] w-full gap-3">
            <header className="absolute inset-0 h-14 px-4">
                <LayoutTopBar
                    user={user}
                    title={title}
                    iconButtons={iconButtons}
                />
            </header>
            <main className="absolute inset-x-4 bottom-4 top-14">
                {children}
            </main>
        </div>
    )
}
