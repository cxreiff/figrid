import type { ComponentPropsWithRef } from "react"
import { Input } from "~/ui/primitives/input.tsx"
import { cn, type IconType } from "~/lib/misc.ts"

export function InputWithIcon({
    icon: Icon,
    className,
    ...props
}: ComponentPropsWithRef<"input"> & {
    icon: IconType
}) {
    return (
        <span className={cn("relative block h-9 rounded-md", className)}>
            <Icon className="absolute inset-y-0 left-3 h-full w-5 px-0.5" />
            <Input className={"h-full pl-11"} {...props} />
        </span>
    )
}
