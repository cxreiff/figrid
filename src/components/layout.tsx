import { Box, Card, Flex } from "@itsmapleleaf/radix-themes"
import { Link } from "@remix-run/react"
import type { ReactNode } from "react"
import type { AuthUser } from "~/auth/auth.server.ts"
import { ProfileButton } from "~/components/profileButton.tsx"

type LayoutProps = {
    user: AuthUser | null
    title: string
    left?: ReactNode
    right?: ReactNode
    center?: ReactNode
}

export function Layout({ user, title, left, right, center }: LayoutProps) {
    return (
        <Flex direction="column" gap="3" p="4" width="100%">
            <Flex align="center" gap="3">
                <Box>
                    <Card className="p-0" asChild>
                        <Link to="/">figrid</Link>
                    </Card>
                </Box>
                <Box grow="1">
                    <Card className="text-center" asChild>
                        <h1>{title}</h1>
                    </Card>
                </Box>
                <Box>
                    <Card asChild>
                        <ProfileButton user={user} />
                    </Card>
                </Box>
            </Flex>
            <main>
                <Flex width="100%" gap="5">
                    <Box
                        grow="1"
                        className="w-1/3"
                        style={{ height: "calc(100vh - 6rem)" }}
                    >
                        {left}
                    </Box>
                    <Box
                        className="w-1/3 max-w-[1200px]"
                        style={{ height: "calc(100vh - 6rem)" }}
                    >
                        {center}
                    </Box>
                    <Box
                        grow="1"
                        className="w-1/3"
                        style={{ height: "calc(100vh - 6rem)" }}
                    >
                        {right}
                    </Box>
                </Flex>
            </main>
        </Flex>
    )
}
