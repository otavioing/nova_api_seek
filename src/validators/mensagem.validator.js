const AppError = require("../utils/AppError");

const iniciarConversa = (req, res, next) => {
    const { id_destinatario } = req.body;
    const errors = [];

    if (!id_destinatario) {
        errors.push({
            campo: "id_destinatario",
            mensagem: "O ID do destinatário é obrigatório."
        });
    }

    if (errors.length > 0) {
        return next(new AppError(errors[0].mensagem, 400, errors));
    }

    next();
};

const enviarMensagem = (req, res, next) => {
    const { mensagem } = req.body;
    const errors = [];

    if (!mensagem || mensagem.trim() === "") {
        errors.push({
            campo: "mensagem",
            mensagem: "A mensagem não pode estar vazia."
        });
    }

    if (errors.length > 0) {
        return next(new AppError(errors[0].mensagem, 400, errors));
    }

    next();
};

module.exports = {
    iniciarConversa,
    enviarMensagem
};