const response = require("../utils/response");
const vagaService = require("../services/vaga.service");

const criar = async (req, res, next) => {
    try {
        const vaga = await vagaService.criar(req.user.id, req.body);

        return response.success(
            res,
            "Vaga criada com sucesso.",
            vaga,
            null,
            201
        );
    } catch (error) {
        next(error);
    }
};

const listar = async (req, res, next) => {
    try {
        const vagas = await vagaService.listar();
        return response.success(res, "Vagas carregadas com sucesso.", vagas, vagas.length);
    } catch (error) {
        next(error);
    }
};

const listarPorCategoria = async (req, res, next) => {
    try {
        const vagas = await vagaService.listarPorCategoria(req.params.categoria);
        return response.success(
            res,
            "Vagas filtradas por categoria carregadas com sucesso.",
            vagas,
            vagas.length
        );
    } catch (error) {
        next(error);
    }
};

const listarPorData = async (req, res, next) => {
    try {
        const vagas = await vagaService.listarPorData(
            req.query.inicio,
            req.query.fim
        );
        return response.success(
            res,
            "Vagas filtradas por data carregadas com sucesso.",
            vagas,
            vagas.length
        );
    } catch (error) {
        next(error);
    }
};

const listarFiltrosMaisUtilizados = async (req, res, next) => {
    try {
        const filtros = await vagaService.listarFiltrosMaisUtilizados(
            req.query.limite
        );
        return response.success(
            res,
            "Filtros mais utilizados carregados com sucesso.",
            filtros,
            filtros.length
        );
    } catch (error) {
        next(error);
    }
};

const listarPorUsuario = async (req, res, next) => {
    try {
        const vagas = await vagaService.listarPorUsuario(req.params.id);

        return response.success(
            res,
            "Vagas do usuário carregadas com sucesso.",
            vagas,
            vagas.length
        );
    } catch (error) {
        next(error);
    }
};

const obter = async (req, res, next) => {
    try {
        const vaga = await vagaService.obter(req.params.id);
        return response.success(res, "Vaga carregada com sucesso.", vaga);
    } catch (error) {
        next(error);
    }
};

const favoritar = async (req, res, next) => {
    try {
        await vagaService.favoritar(req.user.id, req.params.id);
        return response.success(res, "Vaga favoritada com sucesso.");
    } catch (error) {
        next(error);
    }
};

const desfavoritar = async (req, res, next) => {
    try {
        await vagaService.desfavoritar(req.user.id, req.params.id);
        return response.success(res, "Vaga removida dos favoritos com sucesso.");
    } catch (error) {
        next(error);
    }
};

const listarFavoritas = async (req, res, next) => {
    try {
        const vagas = await vagaService.listarFavoritas(req.user.id);
        return response.success(
            res,
            "Vagas favoritas carregadas com sucesso.",
            vagas,
            vagas.length
        );
    } catch (error) {
        next(error);
    }
};

module.exports = {
    criar,
    listar,
    listarPorCategoria,
    listarPorData,
    listarFiltrosMaisUtilizados,
    listarPorUsuario,
    obter,
    favoritar,
    desfavoritar,
    listarFavoritas
};
