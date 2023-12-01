import { Avatar } from "@itsmapleleaf/radix-themes"
import { type AuthUser } from "~/auth/auth.server.ts"

type ProfileAvatarProps = {
    user: AuthUser
}

export function ProfileAvatar({ user }: ProfileAvatarProps) {
    return (
        <Avatar
            src={user.profile.image_url || ""}
            fallback={user.alias.slice(0, 3)}
            color="ruby"
            size="4"
        />
    )
}
