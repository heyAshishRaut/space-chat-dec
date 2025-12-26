import { Router } from "express"
import {
    createAccount, loginUser, logoutUser, resendEmailVerificationCode, refreshAccessToken, emailVerification, getUserDetails
} from "../controllers/user.controllers.js"
import verifyJWT from "../middlewares/user.middlewares.js"

const router = Router()

// Unsecured routes
router.route("/register").post(createAccount)
router.route("/verify-email").post(emailVerification)
router.route("/login").post(loginUser)
router.route("/resend-email-verification-code").post(resendEmailVerificationCode)
router.route("/refresh-access-token").post(refreshAccessToken)

// Secured routes
router.route("/logout").post(verifyJWT, logoutUser)
router.route("/user-details").get(verifyJWT, getUserDetails)

export default router