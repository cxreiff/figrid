import {
    S3Client,
    type PutObjectCommandInput,
    DeleteObjectCommand,
} from "@aws-sdk/client-s3"
import { Upload } from "@aws-sdk/lib-storage"
import { writeAsyncIterableToWritable } from "@remix-run/node"
import type { UploadHandler } from "@vercel/remix"
import { PassThrough } from "stream"

function r2Client() {
    return new S3Client({
        region: "auto",
        endpoint: process.env.R2_ASSETS_ENDPOINT,
        credentials: {
            accessKeyId: process.env.R2_ASSETS_ACCESS_KEY,
            secretAccessKey: process.env.R2_ASSETS_SECRET_KEY,
        },
    })
}

function uploadStream({
    Key,
    ContentType,
}: Pick<PutObjectCommandInput, "Key" | "ContentType">) {
    const r2 = r2Client()
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

export const createR2UploadHandler: (
    prefix: string,
    key: string,
) => UploadHandler = (prefix, key) => {
    return async ({ name, data, contentType }) => {
        if (name !== "asset") {
            return undefined
        }
        const extension = contentType.split("/")[1]
        const extensionWithDot = extension ? `.${extension}` : ""
        const keyWithExtension = `${key}${extensionWithDot}`
        return (await uploadStreamToR2(
            data,
            `${prefix}/${keyWithExtension}`,
            contentType,
        ))
            ? keyWithExtension
            : undefined
    }
}

export async function deleteResource(key: string) {
    const r2 = r2Client()
    return await r2.send(
        new DeleteObjectCommand({
            Bucket: process.env.R2_ASSETS_BUCKET_NAME,
            Key: key,
        }),
    )
}
