const response = require("../utils/response");

const criar = (req, res, next) => {
    const body = req.body || {};
    const url = body.url || body.link_vaga || body.link;
    const titulo = body.titulo || body.title;
    const descricao = body.descricao || body.descricao_vaga;
    let categorias = body.categorias;
    const errors = [];

    if (categorias === undefined) {
        const categoria = body.id_categoria ||
            body.idCategoria ||
            body.categoria;
        categorias = categoria === undefined ? undefined : [categoria];
    }

    if (!url) {
        errors.push({ campo: "url", mensagem: "Link da vaga é obrigatório." });
    } else {
        try {
            const urlValida = new URL(url);
            if (!urlValida.protocol.startsWith("http")) {
                throw new Error();
            }
        } catch (error) {
            errors.push({ campo: "url", mensagem: "Informe uma URL válida." });
        }
    }

    if (titulo !== undefined && typeof titulo !== "string") {
        errors.push({ campo: "titulo", mensagem: "Título deve ser texto." });
    }

    if (descricao !== undefined && typeof descricao !== "string") {
        errors.push({ campo: "descricao", mensagem: "Descrição deve ser texto." });
    }

    let categoriasNormalizadas = categorias;
    if (typeof categoriasNormalizadas === "string") {
        try {
            categoriasNormalizadas = JSON.parse(categoriasNormalizadas);
        } catch (error) {
            categoriasNormalizadas = null;
        }
    }

    if (!Array.isArray(categoriasNormalizadas) || categoriasNormalizadas.length === 0) {
        errors.push({
            campo: "categorias",
            mensagem: "Informe pelo menos uma categoria."
        });
    } else if (categoriasNormalizadas.some(categoria => {
        if (typeof categoria === "number") {
            return !Number.isInteger(categoria) || categoria <= 0;
        }

        return typeof categoria !== "string" || !categoria.trim();
    })) {
        errors.push({
            campo: "categorias",
            mensagem: "Categorias devem ser textos não vazios."
        });
    }

    if (errors.length > 0) {
        return response.error(res, "Dados da vaga inválidos.", 400, errors);
    }

    req.body = body;
    req.body.categorias = categoriasNormalizadas;
    req.body.url = url;
    req.body.titulo = titulo;
    req.body.descricao = descricao;
    next();
};

const validarId = (req, res, next) => {
    if (!Number.isInteger(Number(req.params.id)) || Number(req.params.id) <= 0) {
        return response.error(res, "ID da vaga inválido.", 400);
    }

    next();
};

const categoria = (req, res, next) => {
    const valor = String(req.params.categoria || "").trim();

    if (!valor || (Number.isInteger(Number(valor)) && Number(valor) <= 0)) {
        return response.error(res, "Categoria inválida.", 400);
    }

    req.params.categoria = valor;
    next();
};

const data = (req, res, next) => {
    const { inicio, fim } = req.query;
    const formatoData = /^\d{4}-\d{2}-\d{2}$/;
    const erros = [];

    if (!inicio || !formatoData.test(inicio)) {
        erros.push({ campo: "inicio", mensagem: "Informe a data inicial no formato YYYY-MM-DD." });
    }

    if (!fim || !formatoData.test(fim)) {
        erros.push({ campo: "fim", mensagem: "Informe a data final no formato YYYY-MM-DD." });
    }

    if (erros.length === 0 && inicio > fim) {
        erros.push({ campo: "data", mensagem: "A data inicial não pode ser maior que a data final." });
    }

    if (erros.length > 0) {
        return response.error(res, "Período de datas inválido.", 400, erros);
    }

    next();
};

const maisUtilizados = (req, res, next) => {
    const limite = req.query.limite === undefined
        ? 5
        : Number(req.query.limite);

    if (!Number.isInteger(limite) || limite < 1 || limite > 20) {
        return response.error(
            res,
            "O limite deve ser um número inteiro entre 1 e 20.",
            400
        );
    }

    req.query.limite = limite;
    next();
};

module.exports = {
    criar,
    validarId,
    categoria,
    data,
    maisUtilizados
};
