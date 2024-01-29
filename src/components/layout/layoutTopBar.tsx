import { Link } from "@remix-run/react"
import type { ReactNode } from "react"
import type { AuthUser } from "~/auth/auth.server.ts"
import { ProfileButton } from "~/components/profileButton.tsx"
import { ThemeToggle } from "~/components/themeToggle.tsx"

export function LayoutTopBar({
    user,
    title,
    iconButtons,
}: {
    user: AuthUser | null
    title: string
    iconButtons?: ReactNode
}) {
    return (
        <div className="flex h-full items-center">
            <Link to="/" className="ml-2">
                <strong className="text-accent-foreground">figrid</strong>
            </Link>
            <hr className="mx-3 flex-1" />
            <h1 className="p-2 text-muted-foreground">{title}</h1>
            <hr className="mx-3 flex-1" />
            {iconButtons}
            <ThemeToggle />
            <ProfileButton user={user} />
        </div>
    )
}
