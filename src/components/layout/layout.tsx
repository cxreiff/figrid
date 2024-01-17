import { type ReactNode, type RefObject } from "react"
import type { ImperativePanelGroupHandle } from "react-resizable-panels"
import type { AuthUser } from "~/auth/auth.server.ts"
import { LayoutTopBar } from "~/components/layout/layoutTopBar.tsx"
import { LayoutSplit } from "~/components/layout/layoutSplit.tsx"

export function Layout({
    children,
    user,
    title,
    iconButtons,
    layoutRef,
    initialLayout,
    minSizes,
    onSaveLayout,
    onResetLayout,
}: {
    children: [ReactNode, ReactNode, ReactNode]
    user: AuthUser | null
    title: string
    iconButtons?: ReactNode
    layoutRef: RefObject<ImperativePanelGroupHandle> | null
    initialLayout: readonly [number, number, number]
    minSizes: readonly [number, number, number]
    onSaveLayout: () => void
    onResetLayout: () => void
}) {
    return (
        <div className="relative h-screen w-full gap-3 p-4">
            <header className="absolute inset-x-4 top-0">
                <LayoutTopBar
                    user={user}
                    title={title}
                    iconButtons={iconButtons}
                    onResetLayout={onResetLayout}
                />
            </header>
            <main className="absolute inset-x-4 bottom-4 top-16">
                <LayoutSplit
                    direction="horizontal"
                    layoutRef={layoutRef}
                    initialLayout={initialLayout}
                    minSizes={minSizes}
                    onSaveLayout={onSaveLayout}
                >
                    {children}
                </LayoutSplit>
            </main>
        </div>
    )
}
