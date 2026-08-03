const notificacoesService = require("../services/notificacoes.service");
const response = require("../utils/response");

const listar = async (req, res, next) => {
    try {
        const idUsuario = req.user.id;
        const notificacoes = await notificacoesService.listarPorUsuario(idUsuario);

        return response.success(
            res,
            "Notificações encontradas.",
            notificacoes,
            notificacoes.length
        );
    } catch (error) {
        next(error);
    }
};

const marcarLida = async (req, res, next) => {
    try {
        const idUsuario = req.user.id;
        const idNotificacao = req.params.id;

        await notificacoesService.marcarComoLida(idNotificacao, idUsuario);

        return response.success(
            res,
            "Notificação atualizada com sucesso."
        );
    } catch (error) {
        next(error);
    }
};

const excluir = async (req, res, next) => {
    try {
        const idUsuario = req.user.id;
        const idNotificacao = req.params.id;

        await notificacoesService.excluirNotificacao(idNotificacao, idUsuario);

        return response.success(
            res,
            "Notificação excluída com sucesso."
        );
    } catch (error) {
        next(error);
    }
};

const limparTudo = async (req, res, next) => {
    try {
        const idUsuario = req.user.id;

        await notificacoesService.excluirTodasAsNotificacoes(idUsuario);

        return response.success(
            res,
            "Todas as notificações foram excluídas com sucesso."
        );
    } catch (error) {
        next(error);
    }
};

module.exports = {
    listar,
    marcarLida,
    excluir,
    limparTudo
};