// cloudinary.js
import { v2 as cloudinary } from "cloudinary"
import fs from "fs"
import dotenv from "dotenv"

dotenv.config()

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})

// const uploadOnCloudinary = async (localFilePath, mimetype) => {
//     try {
//         if (!localFilePath) return null
//
//         const isImage = mimetype?.startsWith("image/")
//
//         const response = await cloudinary.uploader.upload(localFilePath, {
//             resource_type: isImage ? "image" : "raw",
//             use_filename: true,
//             unique_filename: false,
//             overwrite: false
//         })
//
//         fs.unlinkSync(localFilePath)
//         return response
//     } catch (e) {
//         console.error("Cloudinary upload error:", e)
//         if (fs.existsSync(localFilePath)) fs.unlinkSync(localFilePath)
//         return null
//     }
// }

const uploadOnCloudinary = (fileBuffer, mimetype) => {
    return new Promise((resolve, reject) => {
        if (!fileBuffer) return resolve(null)

        const isImage = mimetype?.startsWith("image/")

        const uploadStream = cloudinary.uploader.upload_stream(
            {
                resource_type: isImage ? "image" : "raw",
                use_filename: true,
                unique_filename: false,
                overwrite: false
            },
            (error, result) => {
                if (error) {
                    console.error("Cloudinary upload error:", error)
                    return reject(error)
                }
                resolve(result)
            }
        )

        uploadStream.end(fileBuffer)
    })
}

const deleteFromCloudinary = async (publicId) => {
    try {
        await cloudinary.uploader.destroy(publicId, {
            resource_type: "raw"
        })
    } catch (e) {
        console.log("Error deleting from cloudinary", e)
    }
}

export { uploadOnCloudinary, deleteFromCloudinary }
