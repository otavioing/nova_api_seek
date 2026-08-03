const notificacoesRepository = require("../repositories/notificacoes.repository");
const AppError = require("../utils/AppError");

const criarNotificacao = async (id_usuario, tipo, titulo, mensagem) => {
    return await notificacoesRepository.create({ id_usuario, tipo, titulo, mensagem });
};

const listarPorUsuario = async (idUsuario) => {
    const notificacoes = await notificacoesRepository.findByUsuarioId(idUsuario);
    
    // Mapeia para retornar um formato booleano mais amigável na API para o campo 'lida'
    return notificacoes.map(n => ({
        ...n,
        lida: n.lida === 1
    }));
};

const marcarComoLida = async (idNotificacao, idUsuario) => {
    const notificacao = await notificacoesRepository.findByIdAndUsuario(idNotificacao, idUsuario);

    if (!notificacao) {
        throw new AppError("Notificação não encontrada ou não pertence ao usuário.", 404);
    }

    await notificacoesRepository.markAsRead(idNotificacao);
    return true;
};

const excluirNotificacao = async (idNotificacao, idUsuario) => {
    const notificacao = await notificacoesRepository.findByIdAndUsuario(idNotificacao, idUsuario);

    if (!notificacao) {
        throw new AppError("Notificação não encontrada ou não pertence ao usuário.", 404);
    }

    await notificacoesRepository.deleteById(idNotificacao);
    return true;
};

const excluirTodasAsNotificacoes = async (idUsuario) => {
    await notificacoesRepository.deleteAllByUsuarioId(idUsuario);
    return true;
};

module.exports = {
    criarNotificacao,
    listarPorUsuario,
    marcarComoLida,
    excluirNotificacao,
    excluirTodasAsNotificacoes
};