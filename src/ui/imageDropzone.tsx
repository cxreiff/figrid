import { useFetcher } from "@remix-run/react"
import { useCallback } from "react"
import * as ReactDropzone from "react-dropzone"
import { removeExtension } from "~/lib/assets.ts"

const useDropzone =
    ReactDropzone.default.useDropzone || ReactDropzone.useDropzone

export function ImageDropzone({
    getActionUrl,
}: {
    getActionUrl: (label: string) => string
}) {
    const fetcher = useFetcher()

    const onDrop = useCallback(
        <T extends File>(acceptedFiles: T[]) => {
            if (acceptedFiles[0]) {
                const formData = new FormData()
                formData.append("asset", acceptedFiles[0])
                const label = removeExtension(acceptedFiles[0].name)
                fetcher.submit(formData, {
                    action: getActionUrl(label),
                    method: "POST",
                    encType: "multipart/form-data",
                })
            }
        },
        [fetcher, getActionUrl],
    )

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: { "image/*": [".png", ".gif", ".jpeg", ".jpg"] },
    })

    return (
        <div
            {...getRootProps({
                className:
                    "h-full w-full rounded-md flex justify-center items-center border " +
                    "hover:bg-[hsla(var(--accent)/0.4)] border-dashed border-accent " +
                    "text-center text-accent-foreground cursor-pointer min-h-8",
            })}
        >
            <input {...getInputProps()} />
            {isDragActive ? <p>drop image here</p> : <p>select an image</p>}
        </div>
    )
}
