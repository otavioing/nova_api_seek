const AppError = require("../utils/AppError");
const response = require("../utils/response");

const errorHandler = (
    error,
    req,
    res,
    next
) => {

    if (error instanceof AppError) {

        return response.error(
            res,
            error.message,
            error.statusCode,
            error.errors
        );

    }

    console.error(error);

    return response.error(
        res,
        "Erro interno do servidor.",
        500
    );

};

module.exports = errorHandler;