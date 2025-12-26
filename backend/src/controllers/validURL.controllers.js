import asyncHandler from "../utils/asyncHandler.js"
import redis from "../db/redis.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"

const checkValidSpaceURL = asyncHandler(async (req, res) => {
    const email = req.user.email
    const { spaceId } = req.body

    const getUserSpaceDetails = await redis.get(`user:${email}`)

    if(!getUserSpaceDetails || getUserSpaceDetails !== spaceId) {
        throw new ApiError(400, "UNAUTHORIZED USER")
    }

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                { },
                "Successfully URL check"
            )
        )
})

export { checkValidSpaceURL }