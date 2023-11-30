import { Avatar } from "@itsmapleleaf/radix-themes"
import { type AuthUser } from "~/auth/authenticator.server.ts"

type ProfileAvatarProps = {
    user: AuthUser
}

export function ProfileAvatar({ user }: ProfileAvatarProps) {
    return (
        <Avatar
            src={user.profile.image_url || ""}
            fallback={user.alias.slice(0, 3)}
            color="ruby"
        />
    )
}
