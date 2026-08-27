const vagaRepository = require("../repositories/vaga.repository");
const categoriaRepository = require("../repositories/categoriaVaga.repository");
const usuarioRepository = require("../repositories/usuario.repository");
const linkedinService = require("./linkedin.service");
const AppError = require("../utils/AppError");

const resolverCategorias = async (categorias) => {

    const ids = [];

    for (const categoriaRecebida of categorias) {
        if (Number.isInteger(Number(categoriaRecebida))) {
            const categoria = await categoriaRepository.findById(
                Number(categoriaRecebida)
            );

            if (!categoria) {
                throw new AppError("Categoria de vaga não encontrada.", 404);
            }

            ids.push(categoria.id);
            continue;
        }

        const nome = String(categoriaRecebida).trim();

        if (!nome) {
            continue;
        }

        const categoria = await categoriaRepository.findByNome(nome);
        const id = categoria
            ? categoria.id
            : await categoriaRepository.create(nome);

        ids.push(id);
    }

    return [...new Set(ids)];
};

const criar = async (empresaId, dados) => {

    const empresa = await usuarioRepository.findById(empresaId);

    if (!empresa) {
        throw new AppError("Usuário não encontrado.", 404);
    }

    if (empresa.tipo_usuario !== "EMPRESA") {
        throw new AppError(
            "Esta rota é exclusiva para usuários do tipo EMPRESA.",
            403
        );
    }

    const metadados = await linkedinService.obterMetadados(dados.url);
    const titulo = dados.titulo?.trim() || metadados.titulo?.trim();
    const descricao = dados.descricao?.trim() || metadados.descricao?.trim();

    if (!titulo || !descricao) {
        throw new AppError(
            "Não foi possível obter título e descrição da vaga. Informe esses campos no corpo da requisição.",
            422
        );
    }

    const vagaId = await vagaRepository.create(
        empresaId,
        titulo,
        descricao,
        dados.url
    );

    const categoriaIds = await resolverCategorias(dados.categorias);

    if (categoriaIds.length > 0) {
        await vagaRepository.addCategorias(vagaId, categoriaIds);
    }

    return await vagaRepository.findById(vagaId);
};

const listar = async () => vagaRepository.findAll();

const listarPorCategoria = async categoria => {
    const vagas = await vagaRepository.findByCategoria(categoria);
    return vagas;
};

const listarPorData = async (dataInicio, dataFim) => {
    const vagas = await vagaRepository.findByData(dataInicio, dataFim);
    return vagas;
};

const listarFiltrosMaisUtilizados = async (limite = 5) => {
    const limiteNormalizado = Number.isInteger(Number(limite))
        ? Number(limite)
        : 5;

    return vagaRepository.findCategoriasMaisUtilizadas(limiteNormalizado);
};

const listarPorUsuario = async usuarioId => {
    const usuario = await usuarioRepository.findById(usuarioId);

    if (!usuario) {
        throw new AppError("Usuário não encontrado.", 404);
    }

    return vagaRepository.findByUsuarioId(usuarioId);
};

const obter = async (vagaId) => {
    const vaga = await vagaRepository.findById(vagaId);

    if (!vaga) {
        throw new AppError("Vaga não encontrada.", 404);
    }

    return vaga;
};

const favoritar = async (usuarioId, vagaId) => {
    await obter(vagaId);

    const favorita = await vagaRepository.findFavorita(usuarioId, vagaId);

    if (!favorita) {
        await vagaRepository.addFavorita(usuarioId, vagaId);
    }
};

const desfavoritar = async (usuarioId, vagaId) => {
    await obter(vagaId);

    const favorita = await vagaRepository.findFavorita(usuarioId, vagaId);

    if (!favorita) {
        throw new AppError("Vaga não está favoritada.", 404);
    }

    await vagaRepository.removeFavorita(usuarioId, vagaId);
};

const listarFavoritas = async usuarioId =>
    vagaRepository.findFavoritasByUsuario(usuarioId);

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
