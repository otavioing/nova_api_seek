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
        descricao,
        visibilidade,
        conteudo_18,
        colaboradores,
        permissao_comentarios
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

    if (!visibilidade) {
        errors.push({
            campo: "visibilidade",
            mensagem:
                "Visibilidade é obrigatória."
        });
    } else if (
        typeof visibilidade !== "string" ||
        !["publico", "privado"].includes(
            visibilidade.toLowerCase()
        )
    ) {
        errors.push({
            campo: "visibilidade",
            mensagem:
                "Visibilidade deve ser 'publico' ou 'privado'."
        });
    }

    if (
        conteudo_18 !== undefined &&
        ![
            "true",
            "false",
            true,
            false,
            "1",
            "0",
            1,
            0
        ].includes(conteudo_18)
    ) {
        errors.push({
            campo: "conteudo_18",
            mensagem:
                "conteudo_18 deve ser true ou false."
        });
    }

    if (colaboradores !== undefined) {
        let colaboradoresArray = colaboradores;

        if (typeof colaboradoresArray === "string") {
            try {
                colaboradoresArray = JSON.parse(colaboradoresArray);
            } catch (error) {
                errors.push({
                    campo: "colaboradores",
                    mensagem:
                        "colaboradores deve ser um array de IDs."
                });
            }
        }

        if (
            !Array.isArray(colaboradoresArray) ||
            colaboradoresArray.some(
                id => Number.isNaN(Number(id)) || Number(id) <= 0
            )
        ) {
            errors.push({
                campo: "colaboradores",
                mensagem:
                    "colaboradores deve conter apenas IDs válidos."
            });
        }
    }

    if (!permissao_comentarios) {
        errors.push({
            campo: "permissao_comentarios",
            mensagem:
                "permissao_comentarios é obrigatória."
        });
    } else if (
        typeof permissao_comentarios !== "string" ||
        ![
            "ninguem",
            "seguidores",
            "todos"
        ].includes(
            permissao_comentarios.toLowerCase()
        )
    ) {
        errors.push({
            campo: "permissao_comentarios",
            mensagem:
                "permissao_comentarios deve ser 'ninguem', 'seguidores' ou 'todos'."
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
