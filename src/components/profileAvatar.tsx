import * as Avatar from "@radix-ui/react-avatar"
import { type AuthUser } from "~/auth/authenticator.server.ts"

type ProfileAvatarProps = {
    user: AuthUser
}

export function ProfileAvatar({ user }: ProfileAvatarProps) {
    return (
        <Avatar.Root className="bg-blackA1 inline-flex h-[45px] w-[45px] select-none items-center justify-center overflow-hidden rounded-full align-middle">
            <Avatar.Image
                className="h-full w-full rounded-[inherit] object-cover"
                src={user.profile.image_url || ""}
                alt={user.alias}
            />
            <Avatar.Fallback className="leading-1 flex h-full w-full items-center justify-center bg-white text-[18px] font-medium text-zinc-800">
                {user.alias.slice(0, 3)}
            </Avatar.Fallback>
        </Avatar.Root>
    )
}
