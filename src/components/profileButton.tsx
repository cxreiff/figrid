import * as DropdownMenu from "@radix-ui/react-dropdown-menu"
import { Form, Link } from "@remix-run/react"
import { type AuthUser } from "~/auth/authenticator.server.ts"
import { ProfileAvatar } from "~/components/profileAvatar.tsx"

type ProfileButtonProps = {
    user: AuthUser | null
}

export function ProfileButton({ user }: ProfileButtonProps) {
    return user ? (
        <DropdownMenu.Root>
            <DropdownMenu.Trigger asChild>
                <button aria-label="user options">
                    <ProfileAvatar user={user} />
                </button>
            </DropdownMenu.Trigger>
            <DropdownMenu.Portal>
                <DropdownMenu.Content
                    className="data-[side=top]:animate-slideDownAndFade data-[side=right]:animate-slideLeftAndFade data-[side=bottom]:animate-slideUpAndFade data-[side=left]:animate-slideRightAndFade min-w-[220px] rounded-md bg-black p-[5px] shadow-[0px_10px_38px_-10px_rgba(22,_23,_24,_0.35),_0px_10px_20px_-15px_rgba(22,_23,_24,_0.2)] will-change-[opacity,transform]"
                    sideOffset={5}
                >
                    <DropdownMenu.Item className="text-violet11 data-[disabled]:text-mauve8 data-[highlighted]:bg-violet9 group relative flex h-[25px] select-none items-center rounded-[3px] px-[5px] pl-[25px] text-[13px] leading-none outline-none data-[disabled]:pointer-events-none data-[highlighted]:text-zinc-200">
                        <Form action="/auth/logout" method="post">
                            <button
                                type="submit"
                                className="ml-auto pl-[20px] text-zinc-200 group-data-[disabled]:text-zinc-200 group-data-[highlighted]:text-white"
                            >
                                log out
                            </button>
                        </Form>
                    </DropdownMenu.Item>
                </DropdownMenu.Content>
            </DropdownMenu.Portal>
        </DropdownMenu.Root>
    ) : (
        <Link to="/auth/login">log in</Link>
    )
}
