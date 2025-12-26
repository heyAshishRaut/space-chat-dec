import asyncHandler from "../utils/asyncHandler.js"
import {ApiError} from "../utils/ApiError.js"
import redis from "../db/redis.js"
import prisma from "../db/prisma.js"
import crypto from "crypto"
import {ApiResponse} from "../utils/ApiResponse.js"

const createSpace = asyncHandler(async (req, res) => {
    const email = req.user.email
    const { spaceName } = req.body

    if(!spaceName) {
        throw new ApiError(400, "Space name not provided")
    }

    const checkIfAlreadyInSpace = await redis.get(`user:${email}`)

    if(checkIfAlreadyInSpace) {
        throw new ApiError(400, "You're already in other space")
    }

    const totalSpaces = await prisma.space.count()

    if(totalSpaces >= 5) {
        throw new ApiError(400, "Can't create new space at this moment")
    }

    const date = new Date(Date.now() + 60 * 60 * 1000)
    const spaceCode = crypto.randomInt(100000, 1000000)

    const createSpace = await prisma.space.create({
        data: {
            spaceName: spaceName,
            spaceCode: spaceCode.toString(),
            expiresAt: date
        }
    })

    const addUser = await prisma.space.update({
        where: {
            id: createSpace.id
        },
        data: {
            members: {
                create: {
                    email: email,
                    admin: true
                }
            }
        }
    })


    const ttlSeconds = Math.floor((date.getTime() - Date.now()) / 1000)

    const markUserInSpace = await redis.set(`user:${email}`, createSpace.id, { ex: ttlSeconds})

    const createList = await redis.sadd(`space:${createSpace.id}`, email)
    await redis.expire(`space:${createSpace.id}`, ttlSeconds)

    await prisma.count.upsert({
        where: { id: 1 },
        update: {
            participants: { increment: 1 },
            spacesCreated: { increment: 1 }
        },
        create: {
            id: 1,
            participants: 1,
            spacesCreated: 1
        }
    })

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                {
                    spaceId: createSpace.id,
                    code: createSpace.spaceCode
                },
                "Space created successfully"
            )
        )
})

const joinSpace = asyncHandler(async (req, res) => {
    const email = req.user.email
    const { spaceCode } = req.body

    if(!spaceCode) {
        throw new ApiError(400, "Space code is mandatory")
    }

    const checkIfAlreadyInSpace = await redis.get(`user:${email}`)

    if(checkIfAlreadyInSpace) {
        throw new ApiError(401, "ALREADY IN SPACE")
    }

    const findSpace = await prisma.space.findFirst({
        where: {
            spaceCode: spaceCode.toString()
        }
    })

    if(!findSpace) {
        throw new ApiError(400, "Invalid space code")
    }

    const totalMembers = await prisma.member.count({
        where: {
            spaceId: findSpace.id
        }
    })

    if(totalMembers >= 10) {
        throw new ApiError(400, "Space is full")
    }

    const now = Date.now()
    const expiresAtMs = findSpace.expiresAt.getTime()

    if(expiresAtMs <= now) {
        throw new ApiError(400, "Room already expired")
    }

    const calcTTL = Math.floor((expiresAtMs - now) / 1000)

    const addUser = await prisma.space.update({
        where: {
            id: findSpace.id
        },
        data: {
            members: {
                create: {
                    email: email
                }
            }
        }
    })

    const markAsInSpace = await redis.set(`user:${email}`, findSpace.id, { ex: calcTTL })
    const addInSpaceList = await redis.sadd(`space:${findSpace.id}`, email)
    await redis.expire(`space:${findSpace.id}`, calcTTL)

    await prisma.count.update({
        where: {
            id: 1
        },
        data: {
            participants: {
                increment: 1
            }
        }
    })

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                {
                    spaceId: findSpace.id,
                    spaceCode: findSpace.spaceCode
                },
                "Successfully joined the space"
            )
        )
})

const leaveSpace = asyncHandler(async (req, res) => {
    const email = req.user.email
    const { spaceId } = req.body
    console.log(email + " " + spaceId)

    const getUserSpaceDetails = await redis.get(`user:${email}`)

    if(!spaceId) {
        throw new ApiError(401, "NOT IN SPACE")
    }

    if(!getUserSpaceDetails || spaceId !== getUserSpaceDetails) {
        throw new ApiError(401, "UNAUTHORIZED USER")
    }

    const removeUserFromMemberTable = await prisma.member.deleteMany({
        where: {
            email: email,
            spaceId: spaceId
        }
    })

    await redis.del(`user:${email}`)
    await redis.srem(`space:${spaceId}`, email)

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                { },
                "Left Space successfully"
            )
        )
})

const deleteSpace = asyncHandler(async (req, res) => {
    const email = req.user.email
    const { spaceId } = req.body

    const getUserSpaceDetails = await redis.get(`user:${email}`)

    if(!spaceId) {
        throw new ApiError(401, "NOT IN SPACE")
    }

    if(!getUserSpaceDetails || getUserSpaceDetails !== spaceId) {
        throw new ApiError(401, "UNAUTHORIZED USER")
    }

    const checkUser = await prisma.member.findFirst({
        where: {
            email: email,
            spaceId: spaceId
        }
    })

    if(!checkUser.admin) {
        throw new ApiError(400, "You're not admin")
    }

    const users = await redis.smembers(`space:${spaceId}`)

    for (const userEmail of users) {
        await redis.del(`user:${userEmail}`)
    }

    await redis.del(`space:${spaceId}`)

    await prisma.space.delete({
        where: {
            id: spaceId
        }
    })

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                { },
                "Space deleted successfully"
            )
        )
})

const validateSpaceId = asyncHandler(async (req, res) => {
    const email = req.user.email
    const fullName = req.user.fullName

    const { spaceId } = req.body

    const getUserSpaceIdFromRedis = await redis.get(`user:${email}`)

    if(!getUserSpaceIdFromRedis) {
        throw new ApiError(400, `Invalid SpaceId`)
    }

    if(spaceId !== getUserSpaceIdFromRedis.toString()) {
        throw new ApiError(400, `Invalid SpaceId`)
    }

    const spaceDetails = await prisma.space.findUnique({
        where: {
            id: spaceId
        }
    })

    if(!spaceDetails) {
        throw new ApiError(400, "Invalid SpaceId")
    }

    const userDetails = await prisma.member.findFirst({
        where: {
            spaceId: spaceId,
            email: email
        }
    })

    if(!userDetails) {
        throw new ApiError(400, "Invalid User")
    }

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                {
                    spaceName: spaceDetails.spaceName,
                    spaceCode: spaceDetails.spaceCode,
                    fullName: fullName,
                    email: userDetails.email,
                    admin: userDetails.admin
                },
                `SpaceId validated successfully`
            )
        )
})


export { createSpace, joinSpace, leaveSpace, deleteSpace, validateSpaceId }