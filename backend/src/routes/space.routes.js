import {Router} from "express"
import verifyJWT from "../middlewares/user.middlewares.js"
import {createSpace, deleteSpace, joinSpace, leaveSpace, validateSpaceId} from "../controllers/space.controllers.js"

const router = Router()

// Secured routes
router.route("/create-space").post(verifyJWT, createSpace)
router.route("/join-space").post(verifyJWT, joinSpace)
router.route("/leave-space").post(verifyJWT, leaveSpace)
router.route("/delete-space").post(verifyJWT, deleteSpace)
router.route("/validate-space-id").post(verifyJWT, validateSpaceId)

export default router