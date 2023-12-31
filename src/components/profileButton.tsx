import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu.tsx"
import { Link } from "@remix-run/react"
import { type AuthUser } from "~/auth/auth.server.ts"
import { Button } from "~/components/ui/button.tsx"
import { ProfileAvatar } from "~/components/profileAvatar.tsx"

export function ProfileButton({ user }: { user: AuthUser | null }) {
    return (
        <DropdownMenu>
            <Button asChild variant="ghost" size="icon">
                <DropdownMenuTrigger
                    aria-label="user options"
                    className="items-center"
                >
                    <ProfileAvatar user={user} />
                </DropdownMenuTrigger>
            </Button>
            <DropdownMenuContent
                color="ruby"
                className="mr-2 mt-2"
                align="center"
            >
                {user ? (
                    <>
                        <DropdownMenuLabel>{user.email}</DropdownMenuLabel>
                        <DropdownMenuLabel>{user.alias}</DropdownMenuLabel>
                        <DropdownMenuLabel hidden={!user.name}>
                            {user.name}
                        </DropdownMenuLabel>
                        <DropdownMenuLabel>
                            {user.type} account
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                            <Link to="/auth/logout">log out</Link>
                        </DropdownMenuItem>
                    </>
                ) : (
                    <>
                        <DropdownMenuItem>
                            <Link to="/auth/login">log in</Link>
                        </DropdownMenuItem>
                    </>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
