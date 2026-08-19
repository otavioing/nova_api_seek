const response = require(
    "../utils/response"
);

const AppError = require(
    "../utils/AppError"
);

const validarCriacaoPost = (
    req,
    res,
    next
) => {

    const {
        titulo,
        descricao
    } = req.body;

    const errors = [];

    if (!titulo) {
        errors.push({
            campo: "titulo",
            mensagem:
                "Título é obrigatório."
        });
    }

    if (!descricao) {
        errors.push({
            campo: "descricao",
            mensagem:
                "Descrição é obrigatória."
        });
    }

    if (errors.length > 0) {

        return response.error(
            res,
            "Erro de validação.",
            400,
            errors
        );
    }

    next();
};

const validarCriacaoComentario = (
    req,
    res,
    next
) => {

    const {
        comentario
    } = req.body;

    const errors = [];

    if (!comentario) {
        errors.push({
            campo: "comentario",
            mensagem:
                "Comentario e obrigatorio."
        });
    }

    if (errors.length > 0) {

        return response.error(
            res,
            "Erro de validacao.",
            400,
            errors
        );
    }

    next();
};

const validarCriacaoResposta = (
    req,
    res,
    next
) => {

    const {
        resposta
    } = req.body;

    const errors = [];

    if (!resposta) {
        errors.push({
            campo: "resposta",
            mensagem:
                "Resposta e obrigatoria."
        });
    }

    if (errors.length > 0) {

        return response.error(
            res,
            "Erro de validacao.",
            400,
            errors
        );
    }

    next();
};

const listarPorCategoria = (req, res, next) => {
    const { id_categoria } = req.params;
    const errors = [];

    if (!id_categoria || isNaN(id_categoria)) {
        errors.push({
            campo: "id_categoria",
            mensagem: "O ID da categoria é obrigatório e deve ser um número."
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

const listarPorUsuario = (req, res, next) => {
    const { id_usuario } = req.params;
    const errors = [];

    if (!id_usuario || isNaN(id_usuario)) {
        errors.push({
            campo: "id_usuario",
            mensagem: "O ID do usuário é obrigatório e deve ser um número."
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

const validarIdPost = (req, res, next) => {
    const { id } = req.params;
    const errors = [];

    if (!id || isNaN(id)) {
        errors.push({
            campo: "id",
            mensagem: "O ID do post é obrigatório e deve ser um número."
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
    validarCriacaoPost,
    validarCriacaoComentario,
    validarCriacaoResposta,
    listarPorCategoria,
    listarPorUsuario,
    validarIdPost
};
