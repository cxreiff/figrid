import { useFetcher } from "@remix-run/react"
import { createContext, useEffect, useState } from "react"
import { z } from "zod"
import { useDebounce } from "~/lib/misc.ts"

export const READ_TABS = ["prompt", "map", "area", "status", "data"] as const
export const INFO_TABS = ["area", "status", "data"] as const
export const WRITE_TABS = [
    "resources",
    "map",
    "editor",
    "details",
    "config",
] as const
export const RESOURCE_TABS = [
    "tiles",
    "characters",
    "items",
    "events",
    "gates",
    "locks",
] as const
export const CENTER_TABS = ["map", "editor"] as const
export const DETAILS_TABS = ["details", "config"] as const

export const tabsCookieSchema = z.object({
    readTab: z.enum(READ_TABS).optional().readonly(),
    infoTab: z.enum(INFO_TABS).optional().readonly(),
    writeTab: z.enum(WRITE_TABS).optional().readonly(),
    resourceTab: z.enum(RESOURCE_TABS).optional().readonly(),
    centerTab: z.enum(CENTER_TABS).optional().readonly(),
    detailsTab: z.enum(DETAILS_TABS).optional().readonly(),
})

type TabsCookieType = z.infer<typeof tabsCookieSchema>

export type TabsContextType = {
    readTab: TabsCookieType["readTab"]
    infoTab: TabsCookieType["infoTab"]
    writeTab: TabsCookieType["writeTab"]
    resourceTab: TabsCookieType["resourceTab"]
    centerTab: TabsCookieType["centerTab"]
    detailsTab: TabsCookieType["detailsTab"]
    setReadTab: (tab: TabsCookieType["readTab"]) => void
    setInfoTab: (tab: TabsCookieType["infoTab"]) => void
    setWriteTab: (tab: TabsCookieType["writeTab"]) => void
    setResourceTab: (tab: TabsCookieType["resourceTab"]) => void
    setCenterTab: (tab: TabsCookieType["centerTab"]) => void
    setDetailsTab: (tab: TabsCookieType["detailsTab"]) => void
}

export const ContextTabs = createContext<TabsContextType>({
    readTab: READ_TABS[0],
    infoTab: INFO_TABS[0],
    writeTab: WRITE_TABS[0],
    resourceTab: RESOURCE_TABS[0],
    centerTab: CENTER_TABS[0],
    detailsTab: DETAILS_TABS[0],
    setReadTab: () => {},
    setInfoTab: () => {},
    setWriteTab: () => {},
    setResourceTab: () => {},
    setCenterTab: () => {},
    setDetailsTab: () => {},
})

export function useInitialTabsContext(
    initialTabs: TabsCookieType,
): TabsContextType {
    const [readTab, setReadTab] = useState(initialTabs.readTab)
    const [infoTab, setInfoTab] = useState(initialTabs.infoTab)
    const [writeTab, setWriteTab] = useState(initialTabs.writeTab)
    const [resourceTab, setResourceTab] = useState(initialTabs.resourceTab)
    const [centerTab, setCenterTab] = useState(initialTabs.centerTab)
    const [detailsTab, setDetailsTab] = useState(initialTabs.detailsTab)
    const fetcher = useFetcher()

    const saveTabs = useDebounce(() => {
        fetcher.submit(
            {
                data: JSON.stringify({
                    readTab,
                    writeTab,
                    resourceTab,
                    centerTab,
                    detailsTab,
                }),
            },
            { action: "/actions/tabs", method: "post" },
        )
    }, 100)

    useEffect(() => {
        saveTabs()
    }, [readTab, writeTab, resourceTab, centerTab, detailsTab, saveTabs])

    return {
        readTab,
        infoTab,
        writeTab,
        resourceTab,
        centerTab,
        detailsTab,
        setReadTab,
        setInfoTab,
        setWriteTab,
        setResourceTab,
        setCenterTab,
        setDetailsTab,
    }
}
