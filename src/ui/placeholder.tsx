export function Placeholder({ children }: { children: string }) {
    return (
        <p className="flex h-full w-full flex-1 items-center justify-center text-center text-muted">
            {children}
        </p>
    )
}
