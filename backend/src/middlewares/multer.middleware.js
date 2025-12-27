import multer from "multer"
// import path from "path"
import { ApiError } from "../utils/ApiError.js"

// const storage = multer.diskStorage({
//     destination(req, file, cb) {
//         cb(null, "./public/temporary")
//     },
//     filename(req, file, cb) {
//         const uniqueSuffix = Date.now()
//         const ext = path.extname(file.originalname)
//         const baseName = path.basename(file.originalname, ext)
//
//         cb(null, `${baseName}-${uniqueSuffix}${ext}`)
//     }
// })

// allowed file types
const allowedMimeTypes = [
    "image/jpeg",
    "image/png",
    "image/jpg",
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/vnd.ms-powerpoint",
    "application/vnd.openxmlformats-officedocument.presentationml.presentation"
]

const fileFilter = (req, file, cb) => {
    if (!allowedMimeTypes.includes(file.mimetype)) {
        return cb(
            new ApiError(400, "Unsupported file"),
            false
        )
    }
    cb(null, true)
}

export const upload = multer({
    storage: multer.memoryStorage(),
    fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024
    }
})
