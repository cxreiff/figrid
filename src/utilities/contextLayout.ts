import { useFetcher } from "@remix-run/react"
import { createContext, type RefObject, useRef } from "react"
import type { ImperativePanelGroupHandle } from "react-resizable-panels"
import { z } from "zod"
import { useDebounce } from "~/utilities/misc.ts"

const DEFAULT_LAYOUT_READ = [30, 40, 30]
const DEFAULT_LAYOUT_AREA = [45, 55]
const DEFAULT_LAYOUT_STATUS = [45, 55]
const DEFAULT_LAYOUT_WRITE = [30, 40, 30]

export const layoutCookieSchema = z.object({
    read: z.array(z.number().min(0).max(100)).length(3).optional(),
    area: z.array(z.number().min(0).max(100)).length(2).optional(),
    status: z.array(z.number().min(0).max(100)).length(2).optional(),
    write: z.array(z.number().min(0).max(100)).length(3).optional(),
})

type LayoutCookieType = z.infer<typeof layoutCookieSchema>

type LayoutContextType = {
    readLayoutRef: RefObject<ImperativePanelGroupHandle> | null
    areaLayoutRef: RefObject<ImperativePanelGroupHandle> | null
    statusLayoutRef: RefObject<ImperativePanelGroupHandle> | null
    writeLayoutRef: RefObject<ImperativePanelGroupHandle> | null
    initialLayout: Required<LayoutCookieType>
    saveLayout: () => void
    resetLayout: () => void
}

export const ContextLayout = createContext<LayoutContextType>({
    readLayoutRef: null,
    areaLayoutRef: null,
    statusLayoutRef: null,
    writeLayoutRef: null,
    initialLayout: {
        read: DEFAULT_LAYOUT_READ,
        area: DEFAULT_LAYOUT_AREA,
        status: DEFAULT_LAYOUT_STATUS,
        write: DEFAULT_LAYOUT_WRITE,
    },
    saveLayout: () => {},
    resetLayout: () => {},
})

export function useInitialLayoutContext(
    initialLayout: LayoutCookieType,
): LayoutContextType {
    const readLayoutRef = useRef<ImperativePanelGroupHandle>(null)
    const areaLayoutRef = useRef<ImperativePanelGroupHandle>(null)
    const statusLayoutRef = useRef<ImperativePanelGroupHandle>(null)
    const writeLayoutRef = useRef<ImperativePanelGroupHandle>(null)
    const fetcher = useFetcher()

    const saveLayout = useDebounce(() => {
        fetcher.submit(
            {
                data: JSON.stringify({
                    read: readLayoutRef.current?.getLayout(),
                    area: areaLayoutRef.current?.getLayout(),
                    status: statusLayoutRef.current?.getLayout(),
                    write: writeLayoutRef.current?.getLayout(),
                }),
            },
            { action: "/action/layout", method: "post" },
        )
    }, 100)

    const resetLayout = () => {
        readLayoutRef.current?.setLayout(DEFAULT_LAYOUT_READ)
        areaLayoutRef.current?.setLayout(DEFAULT_LAYOUT_AREA)
        statusLayoutRef.current?.setLayout(DEFAULT_LAYOUT_STATUS)
        writeLayoutRef.current?.setLayout(DEFAULT_LAYOUT_WRITE)
        fetcher.submit(null, {
            action: "/action/layout/delete",
            method: "post",
        })
    }

    return {
        readLayoutRef: readLayoutRef,
        areaLayoutRef: areaLayoutRef,
        statusLayoutRef: statusLayoutRef,
        writeLayoutRef: writeLayoutRef,
        initialLayout: {
            read: initialLayout.read || DEFAULT_LAYOUT_READ,
            area: initialLayout.area || DEFAULT_LAYOUT_AREA,
            status: initialLayout.status || DEFAULT_LAYOUT_STATUS,
            write: initialLayout.write || DEFAULT_LAYOUT_WRITE,
        },
        saveLayout,
        resetLayout,
    }
}
