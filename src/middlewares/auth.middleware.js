const jwt = require("jsonwebtoken");

const AppError = require("../utils/AppError");

const auth = async (
    req,
    res,
    next
) => {

    try {

        const token = req.cookies.token;

        if (!token) {
            throw new AppError(
                "Token não informado.",
                401
            );
        }

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        req.user = {
            id: decoded.id,
            email: decoded.email,
            tipo_usuario: decoded.tipo_usuario
        };

        next();

    } catch (error) {

        if (
            error.name === "JsonWebTokenError" ||
            error.name === "TokenExpiredError"
        ) {
            return next(
                new AppError(
                    "Token inválido ou expirado.",
                    401
                )
            );
        }

        next(error);

    }

};

module.exports = auth;