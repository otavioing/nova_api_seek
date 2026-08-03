const AppError = require("../utils/AppError");

const validarIdParam = (req, res, next) => {
    const { id } = req.params;
    const errors = [];

    if (!id || isNaN(id)) {
        errors.push({
            campo: "id",
            mensagem: "O ID da notificação informado é inválido ou obrigatório."
        });
    }

    if (errors.length > 0) {
        return next(new AppError(errors[0].mensagem, 400, errors));
    }

    next();
};

module.exports = {
    validarIdParam
};