import {Router} from "express"
import verifyJWT from "../middlewares/user.middlewares.js"
import {checkValidSpaceURL} from "../controllers/validURL.controllers.js"

const router = Router()

// Secured routes
router.route("/check-valid-space").post(verifyJWT, checkValidSpaceURL)