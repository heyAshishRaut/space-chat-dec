import asyncHandler from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js"
import prisma from "../db/prisma.js"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { sendEmail } from "../utils/mail.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import crypto from "crypto"

const generateToken = (email, id) => {

    const accessToken = generateAccessToken(email, id)
    const refreshToken = generateRefreshToken(id)

    return {accessToken, refreshToken}
}

const generateAccessToken = (email, id) => {
    return jwt.sign(
        {
            id: id,
            email: email
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}

const generateRefreshToken = (id) => {
    return jwt.sign(
        {
            id: id
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}

const createAccount = asyncHandler(async (req, res) => {
    const {fullName, email, password} = req.body

    if (!fullName || !email || !password) {
        throw new ApiError(400, "All fields are mandatory")
    }

    const checkExists = await prisma.user.findUnique({
        where: {
            email: email
        }
    })

    if (checkExists) {
        throw new ApiError(400, "Account already exists")
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const emailVerificationCode = crypto.randomInt(100000, 1000000)

    const hashedEmailVerificationCode = await bcrypt.hash(emailVerificationCode.toString(), 10)
    const emailVerificationExpiry = new Date(Date.now() + 10 * 60 * 1000)

    const user = await prisma.user.create({
        data: {
            fullName,
            email,
            hashedPassword,
            isVerified: false,
            refreshToken: "",
            emailVerificationToken: hashedEmailVerificationCode,
            emailVerificationExpiry: emailVerificationExpiry
        }
    })

    const sendEmailToUser = await sendEmail(email, emailVerificationCode)

    if (!sendEmailToUser.success) {
        throw new ApiError(400, "Failed to send verification code")
    }

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                {
                    user: email
                },
                `Verification code has been send to your email.`
            )
        )
})

const emailVerification = asyncHandler(async (req, res) => {
    const {email, otp} = req.body

    if (!email || !otp) {
        throw new ApiError(400, "All fields are required")
    }

    const user = await prisma.user.findFirst({
        where: {
            email: email
        }
    })

    if (!user) {
        throw new ApiError(400, "User not exists")
    }

    if (user.isVerified) {
        throw new ApiError(400, "User already verified")
    }

    if (!user.emailVerificationExpiry || user.emailVerificationExpiry < new Date()) {
        throw new ApiError(400, "Token is expired. Try again!")
    }

    const compareOtp = await bcrypt.compare(otp.toString(), user.emailVerificationToken)

    if (!compareOtp) {
        throw new ApiError(400, "Invalid verification code")
    }

    const {accessToken, refreshToken} = generateToken(user.email, user.id)

    await prisma.user.update({
        where: {
            email: email
        },
        data: {
            isVerified: true,
            refreshToken: refreshToken,
            emailVerificationToken: "",
            emailVerificationExpiry: new Date(Date.now())
        }
    })

    const options = {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        path: "/"
    }

    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(
                200,
                "Welcome! Team Space"
            )
        )
})

const loginUser = asyncHandler(async (req, res) => {
    const {email, password} = req.body
    console.log(email + " " + password)

    if (!email || !password) {
        throw new ApiError(400, "All fields are mandatory")
    }

    console.log("Passed 01") // WORKING TILL HERE ONLY

    const user = await prisma.user.findFirst({
        where: {
            email: email
        }
    })
    console.log("Passed 02")

    if (!user || !user.hashedPassword) {
        throw new ApiError(400, "User not exists")
    }
    console.log("Passed 03")

    const check = await bcrypt.compare(password, user?.hashedPassword)

    if (!check) {
        throw new ApiError(400, "Invalid password")
    }
    console.log("Passed 04")

    if (!user?.isVerified) {
        throw new ApiError(403, "Email not verified")
    }
    console.log("Passed 02=5")

    const {accessToken, refreshToken} = generateToken(email, user.id)

    console.log("Passed 06")

    await prisma.user.update({
        where: {
            id: user.id
        },
        data: {
            refreshToken: refreshToken
        }
    })

    const options = {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        path: "/"
    }

    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(
                200,
                `Welcome Back ${user.fullName.split(" ")[0]} ! Team Space`
            )
        )
})

const logoutUser = asyncHandler(async (req, res) => {
    const email = req.user.email

    await prisma.user.update({
        where: {
            email: email
        },
        data: {
            refreshToken: ""
        }
    })

    const options = {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        path: "/"
    }

    return res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(
            new ApiResponse(
                200,
                "User logged out successfully"
            )
        )
})

const getUserDetails = asyncHandler(async (req, res) => {
    const email = req.user.email

    const user = await prisma.user.findUnique({
        where: {
            email: email
        }
    })

    return res
        .json(
            new ApiResponse(
                200,
                {
                    fullName: user?.fullName,
                    email: user?.email
                },
                "User details fetched successfully"
            )
        )
})

const refreshAccessToken = asyncHandler(async (req, res) => {
    const incomingRefreshToken = req.cookies.refreshToken || req.get("Authorization")?.replace("Bearer ", "")

    if (!incomingRefreshToken) {
        throw new ApiError(
            400,
            "Refresh Token missing"
        )
    }

    try {
        const decodeToken = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET)

        if (!decodeToken) {
            throw new ApiError(
                401,
                "INVALID_REFRESH_TOKEN"
            )
        }

        const user = await prisma.user.findFirst({
            where: {
                id: decodeToken.id
            }
        })

        if (!user) {
            throw new ApiError(
                401,
                "INVALID_REFRESH_TOKEN"
            )
        }

        const { accessToken, refreshToken } = generateToken(user?.email, user?.id)

        await prisma.user.update({
            where: {
                id: user.id
            },
            data: {
                refreshToken: refreshToken
            }
        })

        const options = {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            path: "/"
        }

        return res
            .status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", refreshToken, options)
            .json(
                new ApiResponse(
                    200,
                    "Access Token Refreshed"
                )
            )
    } catch(e) {
        throw new ApiError(401, "Invalid Refresh Token")
    }
})

const resendEmailVerificationCode = asyncHandler(async (req, res) => {
    const { email } = req.body

    const checkUser = prisma.user.findUnique({
        where: {
            email: email
        }
    })

    if (!checkUser) {
        throw new ApiError(400, "Account not exists")
    }

    const emailVerificationCode = crypto.randomInt(100000, 1000000)
    const hashedEmailVerificationCode = await bcrypt.hash(emailVerificationCode.toString(), 10)

    const emailVerificationExpiry = new Date(Date.now() + 10 * 60 * 1000)

    const user = await prisma.user.update({
        where: {
            email: email
        },
        data: {
            emailVerificationToken: hashedEmailVerificationCode,
            emailVerificationExpiry: emailVerificationExpiry
        }
    })


    const sendEmailToUser = await sendEmail(email, emailVerificationCode)

    if (!sendEmailToUser.success) {
        throw new ApiError(400, "Failed to send verification code")
    }

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                {
                    user: email
                },
                `Verification code has been send to your email.`
            )
        )
})

export {
    createAccount, emailVerification, getUserDetails, refreshAccessToken, loginUser, logoutUser, resendEmailVerificationCode
}