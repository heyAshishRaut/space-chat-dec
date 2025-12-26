import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import cookieParser from "cookie-parser"

dotenv.config()

const app = express()

app.use(express.json({ limit: "16kb" }))
app.use(express.urlencoded({ extended: true, limit: "16kb" }))
app.use(express.static("public"))
app.use(cookieParser())
app.use(
    cors({
        origin: process.env.CORS_ORIGIN,
        credentials: true
    })
)

// Import routes
import healthCheckRouter from "./routes/healthCheck.routes.js"
import userRouter from "./routes/user.routes.js"
import spaceRouter from "./routes/space.routes.js"
import messageRouter from "./routes/message.routes.js"

import errorHandler from "./middlewares/error.middleware.js"

// Routes
app.use("/api/v1/healthcheck", healthCheckRouter)
app.use("/api/v1/user", userRouter)
app.use("/api/v1/space-settings", spaceRouter)
app.use("/api/v1/messages", messageRouter)

app.use(errorHandler)

const PORT = process.env.PORT

app.listen(PORT, () => {
    console.log(`http://localhost:${PORT}`)
})