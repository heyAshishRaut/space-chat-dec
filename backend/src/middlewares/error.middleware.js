// error.middleware.js
import { ApiError } from "../utils/ApiError.js"

const errorHandler = (err, req, res, next) => {
    // Handle ApiError
    if (err instanceof ApiError) {
        return res.status(err.statusCode).json({
            success: false,
            message: err.message,
            errors: err.errors || [],
        })
    }

    // Handle unknown errors
    return res.status(500).json({
        success: false,
        message: "Internal Server Error",
    })
}

export default errorHandler
