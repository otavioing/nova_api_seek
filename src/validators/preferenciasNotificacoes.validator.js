const AppError = require("../utils/AppError");

const update = (req, res, next) => {
    const { preferencias } = req.body;
    const errors = [];

    if (!preferencias || typeof preferencias !== "object") {
        errors.push({
            campo: "preferencias",
            mensagem: "O objeto de preferências é obrigatório."
        });
    }

    
    if (errors.length > 0) {
        return next(
            new AppError(
                errors[0].mensagem,
                400,
                errors
            )
        );
    }

    next();
};

module.exports = {
    update
};