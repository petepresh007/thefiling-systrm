const CustomApiError = require("./CustomApiError");

class BadRequestError extends CustomApiError {
    constructor(message) {
        super(message);
        this.statusCode = 400;
    }
}

module.exports = BadRequestError;