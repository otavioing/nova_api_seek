const response = require(
    "../utils/response"
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

module.exports = {
    validarCriacaoPost,
    validarCriacaoComentario,
    validarCriacaoResposta
};
