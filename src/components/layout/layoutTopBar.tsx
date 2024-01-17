import { LayoutIcon } from "@radix-ui/react-icons"
import { Link } from "@remix-run/react"
import type { ReactNode } from "react"
import type { AuthUser } from "~/auth/auth.server.ts"
import { ProfileButton } from "~/components/profileButton.tsx"
import { ThemeToggle } from "~/components/themeToggle.tsx"
import { Button } from "~/components/ui/button.tsx"

export function LayoutTopBar({
    user,
    title,
    iconButtons,
    onResetLayout,
}: {
    user: AuthUser | null
    title: string
    iconButtons?: ReactNode
    onResetLayout: () => void
}) {
    return (
        <div className="flex h-16 items-center">
            <Link to="/" className="ml-2">
                <strong className="text-accent-foreground">figrid</strong>
            </Link>
            <hr className="mx-3 flex-1" />
            <h1 className="p-2">{title}</h1>
            <hr className="mx-3 flex-1" />
            {iconButtons}
            <Button variant="ghost" size="icon" onClick={onResetLayout}>
                <LayoutIcon className="h-5 w-5" />
            </Button>
            <ThemeToggle />
            <ProfileButton user={user} />
        </div>
    )
}
