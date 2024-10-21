// @desc this class is responsible about operation error (errors i can predict)
class ApiError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        this.status = `${statusCode}`.startsWith(4) ? "fail" : "error";
        this.isOperational = true;
    }
}

export default ApiError;