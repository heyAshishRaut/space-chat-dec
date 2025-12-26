import asyncHandler from "../utils/asyncHandler.js"
import {ApiError} from "../utils/ApiError.js"
import prisma from "../db/prisma.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import redis from "../db/redis.js"
import { deleteFromCloudinary, uploadOnCloudinary } from "../utils/cloudinary.js"

const getAllMessages = asyncHandler(async (req, res) => {
    const { spaceId } = req.body

    const messages = await prisma.message.findMany({
        where: {
            spaceId: spaceId
        }
    })

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                {
                    messages: messages
                },
                `Messages fetched successfully`
            )
        )
})

const addMessage = asyncHandler(async (req, res) => {
    const email = req.user.email
    const firstName = req.user.firstName

    const { text, spaceId } = req.body
    const uploadedFile = req.file

    if(!text && !uploadedFile) {
        throw new ApiError(400, "Message or file is required")
    }

    const validateUser = await redis.get(`user:${email}`)

    if(!validateUser) {
        throw new ApiError(401, "UNAUTHORIZED_ACCESS")
    }

    let fileUrl = null
    let cloudinaryPublicId = null
    let messageType = "text"

    if (uploadedFile) {
        const uploadResult = await uploadOnCloudinary(uploadedFile.path, uploadedFile.mimetype)
        if (!uploadResult) {
            throw new ApiError(500, "File upload failed")
        }

        const uploadKey = `upload:${email}`
        const MAX_UPLOADS = 5

        // Increment upload count
        const uploadCount = await redis.incr(uploadKey)

        if (uploadCount === 1) {
            // e.g. reset limit after 24 hours
            await redis.expire(uploadKey, 60 * 60 * 24)
        }

        // If limit exceeded
        if (uploadCount > MAX_UPLOADS) {
            throw new ApiError(400, "UPLOAD_LIMIT_EXCEEDED")
        }

        fileUrl = uploadResult.url
        cloudinaryPublicId = uploadResult.public_id

        // Message Type
        if (uploadedFile.mimetype.startsWith("image/")) {
            messageType = "image"
        } else {
            messageType = "file"
        }
    }

    try {
        await prisma.message.create({
            data: {
                firstName,
                email,
                text: text || null,
                file: fileUrl || null,
                type: messageType,
                likes: 0,
                spaceId
            }
        })
    } catch(e) {
        if (cloudinaryPublicId) {
            await deleteFromCloudinary(cloudinaryPublicId)
        }
        throw new ApiError(500, "Failed to save message")
    }

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                { },
                "Message send successfully"
            )
        )
})

const toggleLike = asyncHandler(async (req, res) => {
    const { messageId } = req.body
    const userEmail = req.user.email

    if (!messageId) {
        throw new ApiError(400, "Message ID required")
    }

    const rateKey = `like:${userEmail}:${messageId}`

    const canLike = await redis.set(rateKey, "1", {
        nx: true,
        ex: 4
    })

    if (!canLike) {
        throw new ApiError(429, "Too many like actions")
    }

    const existingLike = await prisma.like.findUnique({
        where: {
            messageId_userEmail: {
                messageId,
                userEmail
            }
        }
    })

    if (existingLike) {
        // UNLIKE
        await prisma.$transaction([
            prisma.like.delete({
                where: { id: existingLike.id }
            }),
            prisma.message.update({
                where: { id: messageId },
                data: { likes: { decrement: 1 } }
            })
        ])

        return res.json({
            liked: false
        })
    }

    // LIKE
    await prisma.$transaction([
        prisma.like.create({
            data: {
                messageId,
                userEmail
            }
        }),
        prisma.message.update({
            where: { id: messageId },
            data: { likes: { increment: 1 } }
        })
    ])

    res.json({
        liked: true
    })
})

const deleteMessage = asyncHandler(async (req, res) => {
    const email = req.user.email
    const { messageId } = req.body

    const validateUser = await redis.get(`user:${email}`)

    if(!validateUser) {
        throw new ApiError(401, "UNAUTHORIZED USER")
    }

    const delMessage = await prisma.message.delete({
        where: {
            id: messageId,
            email: email
        }
    })

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                { },
                "Message deleted successfully"
            )
        )
})



export { getAllMessages, addMessage, toggleLike, deleteMessage }