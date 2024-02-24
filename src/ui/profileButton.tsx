import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "~/ui/primitives/dropdown-menu.tsx"
import { Link } from "@remix-run/react"
import { type AuthUser } from "~/auth/auth.server.ts"
import { Button } from "~/ui/primitives/button.tsx"
import { ProfileAvatar } from "~/ui/profileAvatar.tsx"

export function ProfileButton({ user }: { user: AuthUser | null }) {
    return (
        <DropdownMenu>
            <Button asChild size="icon">
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
                        <DropdownMenuItem asChild>
                            <Link to="/auth/logout" className="cursor-pointer">
                                log out
                            </Link>
                        </DropdownMenuItem>
                    </>
                ) : (
                    <>
                        <DropdownMenuItem asChild>
                            <Link to="/auth/login" className="cursor-pointer">
                                log in
                            </Link>
                        </DropdownMenuItem>
                    </>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
