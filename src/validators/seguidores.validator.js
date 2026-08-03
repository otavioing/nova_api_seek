const AppError = require("../utils/AppError");

const validarIdUsuario = (req, res, next) => {

    const { id } = req.params;

    const errors = [];

    if (!id) {
        errors.push({
            campo: "id",
            mensagem: "O id do usuário é obrigatório."
        });
    }

    if (
        id &&
        (!Number.isInteger(Number(id)) || Number(id) <= 0)
    ) {
        errors.push({
            campo: "id",
            mensagem: "O id do usuário deve ser um número inteiro positivo."
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
    validarIdUsuario
};