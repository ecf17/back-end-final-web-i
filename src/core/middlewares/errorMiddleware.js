import ApiError from '../errors/ApiError.js';

function errorMiddleware(err, req, res, next) {
    if (err instanceof ApiError) {
        return res.status(err.statusCode).json({ message: err.message });
    }
    console.log("Unhandled error: ", err);
    return res.status(500).json(
        {
            error: err.code || "UNKNOWN_ERROR",
            message: err.message || "Internal server error",
        }
    );
}

export default errorMiddleware;
