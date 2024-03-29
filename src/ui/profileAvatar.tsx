import { AvatarIcon } from "@radix-ui/react-icons"
import { type AuthUser } from "~/auth/auth.server.ts"
import { Avatar, AvatarFallback, AvatarImage } from "~/ui/primitives/avatar.tsx"

export function ProfileAvatar({ user }: { user: AuthUser | null }) {
    return user ? (
        <Avatar className="-m-2 h-5 w-5">
            <AvatarImage src={user?.profile.image_url || undefined} />
            <AvatarFallback>{user.alias.slice(0, 3)}</AvatarFallback>
        </Avatar>
    ) : (
        <AvatarIcon className="h-5 w-5" />
    )
}
