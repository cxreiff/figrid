import { useFetcher, useParams } from "@remix-run/react"
import { useCallback } from "react"
import * as ReactDropzone from "react-dropzone"
import { removeExtension } from "~/lib/assets.ts"
import { paramsSchema } from "~/routes/write+/$gridId+/$resourceType+/$resourceId+/_index.tsx"
import type { action } from "~/routes/write+/$gridId+/$resourceType+/$resourceId+/assets.$assetType.$label.ts"

const useDropzone =
    ReactDropzone.default.useDropzone || ReactDropzone.useDropzone

export function ImageDropzone() {
    const { resourceType, resourceId } = paramsSchema
        .partial()
        .parse(useParams())
    const fetcher = useFetcher<typeof action>()

    const onDrop = useCallback(
        <T extends File>(acceptedFiles: T[]) => {
            if (acceptedFiles[0] && resourceType && resourceId) {
                const formData = new FormData()
                formData.append("asset", acceptedFiles[0])
                const label = removeExtension(acceptedFiles[0].name)
                fetcher.submit(formData, {
                    action: `${resourceType}/${resourceId}/assets/images/${label}`,
                    method: "POST",
                    encType: "multipart/form-data",
                })
            }
        },
        [fetcher, resourceType, resourceId],
    )

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: { "image/*": [".png", ".gif", ".jpeg", ".jpg"] },
    })

    return (
        <div
            {...getRootProps({
                className:
                    "h-full w-full rounded-md flex justify-center items-center border hover:bg-[hsla(var(--accent)/0.4)] border-dashed border-accent text-center text-accent-foreground cursor-pointer min-h-8",
            })}
        >
            <input {...getInputProps()} />
            {isDragActive ? (
                <p>drop files here</p>
            ) : (
                <p>drag and drop or click to select</p>
            )}
        </div>
    )
}
