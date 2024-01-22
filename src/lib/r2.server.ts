import { S3Client, type PutObjectCommandInput } from "@aws-sdk/client-s3"
import { Upload } from "@aws-sdk/lib-storage"
import { writeAsyncIterableToWritable } from "@remix-run/node"
import type { UploadHandler } from "@vercel/remix"
import { PassThrough } from "stream"

const uploadStream = ({
    Key,
    ContentType,
}: Pick<PutObjectCommandInput, "Key" | "ContentType">) => {
    const r2 = new S3Client({
        region: "auto",
        endpoint: process.env.R2_ASSETS_ENDPOINT,
        credentials: {
            accessKeyId: process.env.R2_ASSETS_ACCESS_KEY,
            secretAccessKey: process.env.R2_ASSETS_SECRET_KEY,
        },
    })
    const passThrough = new PassThrough()
    return {
        stream: passThrough,
        promise: new Upload({
            client: r2,
            leavePartsOnError: false,
            params: {
                Bucket: process.env.R2_ASSETS_BUCKET_NAME,
                Key,
                Body: passThrough,
                ContentType,
            },
        }).done(),
    }
}

async function uploadStreamToR2(
    data: AsyncIterable<Uint8Array>,
    key: string,
    contentType: string,
) {
    const { stream, promise } = uploadStream({
        Key: key,
        ContentType: contentType,
    })
    await writeAsyncIterableToWritable(data, stream)
    const file = await promise
    return file.Location
}

export const createR2UploadHandler: (key: string) => UploadHandler = (key) => {
    return async ({ name, data, contentType }) => {
        if (name !== "asset") {
            return undefined
        }
        const extension = contentType.split("/")[1]
        const extensionWithDot = extension ? `.${extension}` : ""
        return await uploadStreamToR2(
            data,
            `${key}${extensionWithDot}`,
            contentType,
        )
    }
}
