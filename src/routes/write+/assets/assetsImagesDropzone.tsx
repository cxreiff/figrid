import { useFetcher, useParams } from "@remix-run/react"
import { useCallback } from "react"
import * as ReactDropzone from "react-dropzone"
import { useSuperMatch } from "~/lib/superjson.ts"
import type { action } from "~/routes/actions+/+assets.upload.$gridId.$resourceType.$assetType.ts"
import { paramsSchema } from "~/routes/write+/$gridId+/+$resourceType.$resourceId.tsx"
import { type loader as childLoader } from "~/routes/write+/$gridId+/+$resourceType.$resourceId.tsx"

const { useDropzone } = ReactDropzone

export function AssetsImagesDropzone() {
    const resource = useSuperMatch<typeof childLoader>(
        "write.$gridId.$resourceType.$resourceId",
    )?.resource
    const { resourceType } = paramsSchema.partial().parse(useParams())
    const fetcher = useFetcher<typeof action>()

    const onDrop = useCallback(
        <T extends File>(acceptedFiles: T[]) => {
            if (acceptedFiles[0] && resource) {
                const formData = new FormData()
                formData.append("asset", acceptedFiles[0])
                fetcher.submit(formData, {
                    action: `/actions/assets/upload/${resource.grid_id}/${resourceType}/images`,
                    method: "POST",
                    encType: "multipart/form-data",
                })
            }
        },
        [fetcher, resource, resourceType],
    )

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: { "image/*": [".png", ".gif", ".jpeg", ".jpg"] },
    })

    return (
        <div {...getRootProps()}>
            <input {...getInputProps()} />
            {isDragActive ? (
                <p>drop files here...</p>
            ) : (
                <p>drag and drop files here, or click to select files</p>
            )}
        </div>
    )
}
