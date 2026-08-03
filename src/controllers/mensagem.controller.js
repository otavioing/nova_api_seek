const response = require("../utils/response");
const mensagemService = require("../services/mensagem.service");
const { montarUrlArquivo } = require("../utils/fileUrl");

const iniciarConversa = async (req, res, next) => {
    try {
        // CORREÇÃO: Usando alias para mapear id_destinatario para idDestinatario
        const { id_destinatario: idDestinatario } = req.body;
        const idRemetente = req.user.id;

        const conversa = await mensagemService.iniciarConversa(idRemetente, idDestinatario);

        return response.success(
            res,
            "Conversa iniciada/encontrada com sucesso.",
            conversa,
            null,
            201
        );
    } catch (error) {
        next(error);
    }
};

const enviarMensagem = async (req, res, next) => {
    try {
        const { id_conversa } = req.params;
        const { mensagem } = req.body;
        const idRemetente = req.user.id;

        const novaMensagem = await mensagemService.enviarMensagem(idRemetente, id_conversa, mensagem);

        return response.success(
            res,
            "Mensagem enviada com sucesso.",
            novaMensagem,
            null,
            201
        );
    } catch (error) {
        next(error);
    }
};

const listarConversas = async (req, res, next) => {
    try {
        const idUsuario = req.user.id;
        const conversas = await mensagemService.listarConversas(idUsuario);

        // 2. Mapeie o resultado para formatar a URL da foto de perfil
        const conversasFormatadas = conversas.map(conversa => ({
            ...conversa,
            foto_perfil: montarUrlArquivo(req, conversa.foto_perfil)
        }));

        return response.success(
            res,
            "Conversas encontradas.",
            conversasFormatadas,
            conversasFormatadas.length
        );
    } catch (error) {
        next(error);
    }
};

const listarMensagens = async (req, res, next) => {
    try {
        const { id_conversa } = req.params;
        const idUsuario = req.user.id;

        const mensagens = await mensagemService.listarMensagens(idUsuario, id_conversa);

        return response.success(
            res,
            "Mensagens encontradas.",
            mensagens,
            mensagens.length
        );
    } catch (error) {
        next(error);
    }
};

module.exports = {
    iniciarConversa,
    enviarMensagem,
    listarConversas,
    listarMensagens
};