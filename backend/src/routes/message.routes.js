import { Router } from "express"
import verifyJWT from "../middlewares/user.middlewares.js"
import {addMessage, getAllMessages, toggleLike} from "../controllers/messages.controllers.js"
import { upload } from "../middlewares/multer.middleware.js"

const router = Router()

// Secured routes
router.route("/add-message").post(verifyJWT, upload.single(`file`), addMessage)
router.route("/all-messages").post(verifyJWT, getAllMessages)
router.route("/toggle-like").post(verifyJWT, toggleLike)

export default router