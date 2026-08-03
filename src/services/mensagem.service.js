const AppError = require("../utils/AppError");
const mensagemRepository = require("../repositories/mensagem.repository");
const usuarioRepository = require("../repositories/usuario.repository");

const iniciarConversa = async (idRemetente, idDestinatario) => {
    if (idRemetente === idDestinatario) {
        throw new AppError("Você não pode iniciar uma conversa consigo mesmo.", 400);
    }

    const destinatario = await usuarioRepository.findById(idDestinatario);
    if (!destinatario) {
        throw new AppError("Usuário destinatário não encontrado.", 404);
    }

    let conversa = await mensagemRepository.findConversaEntreUsuarios(idRemetente, idDestinatario);

    if (!conversa) {
        const idConversa = await mensagemRepository.createConversa();
        await mensagemRepository.addParticipante(idConversa, idRemetente);
        await mensagemRepository.addParticipante(idConversa, idDestinatario);
        
        return { id_conversa: idConversa };
    }

    return conversa;
};

const enviarMensagem = async (idRemetente, idConversa, texto) => {
    const conversaExiste = await mensagemRepository.findConversaById(idConversa, idRemetente);
    
    if (!conversaExiste) {
        throw new AppError("Conversa não encontrada ou você não tem permissão para acessá-la.", 403);
    }

    const idMensagem = await mensagemRepository.createMensagem(idConversa, idRemetente, texto);
    
    return {
        id_mensagem: idMensagem,
        id_conversa: idConversa,
        mensagem: texto,
        id_remetente: idRemetente
    };
};

const listarConversas = async (idUsuario) => {
    const conversas = await mensagemRepository.findConversasDoUsuario(idUsuario);
    return conversas;
};

const listarMensagens = async (idUsuario, idConversa) => {
    const conversaExiste = await mensagemRepository.findConversaById(idConversa, idUsuario);
    
    if (!conversaExiste) {
        throw new AppError("Conversa não encontrada ou você não tem permissão para acessá-la.", 403);
    }

    const mensagens = await mensagemRepository.findMensagensDaConversa(idConversa);
    return mensagens;
};

module.exports = {
    iniciarConversa,
    enviarMensagem,
    listarConversas,
    listarMensagens
};