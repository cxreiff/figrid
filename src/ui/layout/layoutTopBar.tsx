import { QuestionMarkCircledIcon } from "@radix-ui/react-icons"
import { Link } from "@remix-run/react"
import type { ReactNode } from "react"
import type { AuthUser } from "~/auth/auth.server.ts"
import { ButtonWithIconLink } from "~/ui/buttonWithIconLink.tsx"
import { ProfileButton } from "~/ui/profileButton.tsx"
import { ThemeToggle } from "~/ui/themeToggle.tsx"

export function LayoutTopBar({
    user,
    title,
    iconButtons,
}: {
    user: AuthUser | null
    title?: string
    iconButtons?: ReactNode
}) {
    return (
        <div className="flex h-full items-center">
            <Link to="/" className="ml-2">
                <strong className="text-accent-foreground">figrid</strong>
            </Link>
            <hr className="mx-3 flex-1" />
            {title && (
                <>
                    <h1 className="overflow-hidden text-ellipsis text-nowrap p-2 text-muted-foreground">
                        {title}
                    </h1>
                    <hr className="mx-3 flex-1" />
                </>
            )}
            <div className="flex items-center text-nowrap">
                {iconButtons}
                <ButtonWithIconLink
                    to="/docs"
                    title="help"
                    icon={QuestionMarkCircledIcon}
                />
                <ThemeToggle />
                <ProfileButton user={user} />
            </div>
        </div>
    )
}
