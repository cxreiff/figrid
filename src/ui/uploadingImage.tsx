import { useEffect, useState } from "react"

export function UploadingImage({ name, url }: { name: string; url: string }) {
    let [objectUrl] = useState(() => {
        if (url.startsWith("blob:")) return url
        return undefined
    })

    useEffect(() => {
        if (objectUrl && !url.startsWith("blob:"))
            URL.revokeObjectURL(objectUrl)
    }, [objectUrl, url])

    return (
        <img
            alt={name}
            src={url}
            className=""
            style={{
                transition: "filter 300ms ease",
                filter: url.startsWith("blob:") ? "blur(4px)" : "blur(0)",
            }}
        />
    )
}
