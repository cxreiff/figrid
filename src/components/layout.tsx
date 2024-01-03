import { LayoutIcon } from "@radix-ui/react-icons"
import { Link } from "@remix-run/react"
import { type ReactNode, useContext, useState } from "react"
import type { AuthUser } from "~/auth/auth.server.ts"
import { ProfileButton } from "~/components/profileButton.tsx"
import { ThemeToggle } from "~/components/themeToggle.tsx"
import { Button } from "~/components/ui/button.tsx"
import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
} from "~/components/ui/resizable.tsx"
import { ContextLayout } from "~/utilities/contextLayout.ts"

export function Layout({
    user,
    title,
    left,
    right,
    center,
}: {
    user: AuthUser | null
    title: string
    left?: ReactNode
    right?: ReactNode
    center?: ReactNode
}) {
    const { mainLayout, initialLayout, resetLayout, saveLayout } =
        useContext(ContextLayout)
    const [leftCollapsed, setLeftCollapsed] = useState(false)
    const [rightCollapsed, setRightCollapsed] = useState(false)

    return (
        <div className="relative h-screen w-full gap-3 p-4">
            <div className="absolute inset-x-4 top-0 flex h-16 items-center">
                <Link to="/">
                    <strong className="text-accent-foreground">figrid</strong>
                </Link>
                <hr className="mx-3 flex-1" />
                <h1 className="p-2">{title}</h1>
                <hr className="mx-3 flex-1" />
                <Button variant="ghost" size="icon" onClick={resetLayout}>
                    <LayoutIcon className="h-5 w-5" />
                </Button>
                <ThemeToggle />
                <ProfileButton user={user} />
            </div>
            <main className="absolute inset-x-4 bottom-4 top-16">
                <ResizablePanelGroup
                    ref={mainLayout}
                    direction="horizontal"
                    className="gap-[0.4rem]"
                    onLayout={saveLayout}
                >
                    <ResizablePanel
                        className="h-[calc(100vh-4rem)] pb-6"
                        minSize={20}
                        defaultSize={initialLayout.main[0]}
                        onCollapse={() => setLeftCollapsed(true)}
                        onExpand={() => setLeftCollapsed(false)}
                        collapsible
                    >
                        {left}
                    </ResizablePanel>
                    <ResizableHandle
                        className={`${
                            leftCollapsed
                                ? "my-auto h-24 w-1 rounded-lg bg-accent hover:bg-accent-foreground"
                                : "h-[calc(100%-4rem)] bg-transparent hover:bg-muted"
                        }`}
                    />
                    <ResizablePanel
                        className="h-[calc(100vh-4rem)] pb-6"
                        minSize={20}
                        defaultSize={initialLayout.main[1]}
                    >
                        {center}
                    </ResizablePanel>
                    <ResizableHandle
                        className={`${
                            rightCollapsed
                                ? "my-auto h-24 w-1 rounded-lg bg-accent hover:bg-accent-foreground"
                                : "h-[calc(100%-4rem)] bg-transparent hover:bg-muted"
                        }`}
                    />
                    <ResizablePanel
                        className="h-[calc(100vh-4rem)] pb-6"
                        minSize={20}
                        defaultSize={initialLayout.main[2]}
                        onCollapse={() => setRightCollapsed(true)}
                        onExpand={() => setRightCollapsed(false)}
                        collapsible
                    >
                        {right}
                    </ResizablePanel>
                </ResizablePanelGroup>
            </main>
        </div>
    )
}
