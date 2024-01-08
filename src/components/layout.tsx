import { LayoutIcon } from "@radix-ui/react-icons"
import { Link } from "@remix-run/react"
import { type ReactNode, useState, type RefObject } from "react"
import type { ImperativePanelGroupHandle } from "react-resizable-panels"
import type { AuthUser } from "~/auth/auth.server.ts"
import { ProfileButton } from "~/components/profileButton.tsx"
import { ThemeToggle } from "~/components/themeToggle.tsx"
import { Button } from "~/components/ui/button.tsx"
import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
} from "~/components/ui/resizable.tsx"
import { cn } from "~/lib/misc.ts"

export function Layout({
    user,
    title,
    left,
    right,
    center,
    iconButtons,
    layoutRef,
    initialLayout,
    onSaveLayout,
    onResetLayout,
}: {
    user: AuthUser | null
    title: string
    left?: ReactNode
    right?: ReactNode
    center?: ReactNode
    iconButtons?: ReactNode
    layoutRef: RefObject<ImperativePanelGroupHandle> | null
    initialLayout: number[]
    onSaveLayout: () => void
    onResetLayout: () => void
}) {
    const [leftCollapsed, setLeftCollapsed] = useState(initialLayout[0] < 20)
    const [rightCollapsed, setRightCollapsed] = useState(initialLayout[2] < 20)

    return (
        <div className="relative h-screen w-full gap-3 p-4">
            <div className="absolute inset-x-4 top-0 flex h-16 items-center">
                <Link to="/" className="ml-2">
                    <strong className="text-accent-foreground">figrid</strong>
                </Link>
                <hr className="mx-3 flex-1" />
                <h1 className="p-2">{title}</h1>
                <hr className="mx-3 flex-1" />
                {iconButtons}
                <Button variant="ghost" size="icon" onClick={onResetLayout}>
                    <LayoutIcon className="h-5 w-5" />
                </Button>
                <ThemeToggle />
                <ProfileButton user={user} />
            </div>
            <main className="absolute inset-x-4 bottom-4 top-16">
                <ResizablePanelGroup
                    ref={layoutRef}
                    direction="horizontal"
                    className="gap-1.5"
                    onLayout={onSaveLayout}
                >
                    <ResizablePanel
                        className="h-[calc(100vh-4rem)] pb-6"
                        minSize={20}
                        defaultSize={initialLayout[0]}
                        onCollapse={() => setLeftCollapsed(true)}
                        onExpand={() => setLeftCollapsed(false)}
                        collapsible
                    >
                        {left}
                    </ResizablePanel>
                    <ResizableHandle
                        neighborCollapsed={leftCollapsed}
                        className={cn({
                            "h-[calc(100%-4rem)]": !leftCollapsed,
                        })}
                    />
                    <ResizablePanel
                        className="h-[calc(100vh-4rem)] pb-6"
                        minSize={20}
                        defaultSize={initialLayout[1]}
                    >
                        {center}
                    </ResizablePanel>
                    <ResizableHandle
                        neighborCollapsed={rightCollapsed}
                        className={cn({
                            "h-[calc(100%-4rem)]": !rightCollapsed,
                        })}
                    />
                    <ResizablePanel
                        className="h-[calc(100vh-4rem)] pb-6"
                        minSize={20}
                        defaultSize={initialLayout[2]}
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
