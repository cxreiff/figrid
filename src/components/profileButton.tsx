import { Card, DropdownMenu } from "@itsmapleleaf/radix-themes"
import { Link } from "@remix-run/react"
import { type AuthUser } from "~/auth/auth.server.ts"
import { ProfileAvatar } from "~/components/profileAvatar.tsx"

type ProfileButtonProps = {
    user: AuthUser | null
}

export function ProfileButton({ user }: ProfileButtonProps) {
    return user ? (
        <DropdownMenu.Root>
            <DropdownMenu.Trigger>
                <button aria-label="user options">
                    <ProfileAvatar user={user} />
                </button>
            </DropdownMenu.Trigger>
            <DropdownMenu.Content color="ruby" className="mr-2 mt-2" align="center">
                <DropdownMenu.Label>{user.email}</DropdownMenu.Label>
                <DropdownMenu.Label>{user.alias}</DropdownMenu.Label>
                <DropdownMenu.Label hidden={!user.name}>
                    {user.name}
                </DropdownMenu.Label>
                <DropdownMenu.Label>{user.type} account</DropdownMenu.Label>
                <DropdownMenu.Separator />
                <DropdownMenu.Item>
                    <Link to="/auth/logout">log out</Link>
                </DropdownMenu.Item>
            </DropdownMenu.Content>
        </DropdownMenu.Root>
    ) : (
        <Card asChild>
            <Link to="/auth/login">log in</Link>
        </Card>
    )
}
