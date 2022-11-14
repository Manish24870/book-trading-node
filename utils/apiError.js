class ApiError extends Error {
    constructor(message, type, statusCode) {
        super(message);
        this.statusCode = statusCode;
        this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
        this.errorType = type;
    }
}

module.exports = ApiError;
