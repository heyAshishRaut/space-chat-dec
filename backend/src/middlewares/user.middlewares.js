import asyncHandler from "../utils/asyncHandler.js"
import jwt from "jsonwebtoken"
import prisma from "../db/prisma.js"
import { ApiError } from "../utils/ApiError.js"

const verifyJWT = asyncHandler(async (req, res, next) => {
    const token = req.cookies?.accessToken || req.get("Authorization")?.replace("Bearer ", "")

    if(!token) {
        throw new ApiError(401, "TOKEN_IS_MISSING")
    }

    try {
        const decodeToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)

        const user = await prisma.user.findUnique({
            where: {
                id: decodeToken?.id
            }
        })

        if(!user) {
            throw new ApiError(401, "INVALID_ACCESS_TOKEN")
        }

        req.user = {
            id: user.id,
            firstName: user.fullName.split(" ")[0],
            fullName: user.fullName,
            email: user.email
        }
        next()
    }
    catch(e) {
        if(e.name === `TokenExpiredError`) {
            throw new ApiError(401, "ACCESS_TOKEN_EXPIRED")
        }
        
        throw new ApiError(401, "INVALID_ACCESS_TOKEN")
    }
})

export default verifyJWT