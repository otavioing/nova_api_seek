const AppError = require("../utils/AppError");
const seguidoresRepository = require("../repositories/seguidores.repository");
const notificacoesService = require("./notificacoes.service");

const seguir = async (idSeguidor, idSeguido) => {

    if (idSeguidor === idSeguido) {
        throw new AppError("Você não pode seguir a si mesmo.", 400);
    }

    const usuario = await seguidoresRepository.buscarUsuarioPorId(idSeguido);

    if (!usuario) {
        throw new AppError("Usuário não encontrado.", 404);
    }

    const seguindo = await seguidoresRepository.jaSegue(
        idSeguidor,
        idSeguido
    );

    if (seguindo) {
        throw new AppError("Você já segue este usuário.", 409);
    }

    await seguidoresRepository.seguir(
        idSeguidor,
        idSeguido
    );

    try {
        await notificacoesService.criarNotificacao(
            idSeguido,
            "NOVO_SEGUIDOR",
            "Você tem um novo seguidor!",
            "Um usuário começou a seguir você."
        );
    } catch (error) {
        console.error("Erro ao enviar notificação de seguidor:", error);
    }

};

const deixarDeSeguir = async (idSeguidor, idSeguido) => {

    const seguindo = await seguidoresRepository.jaSegue(
        idSeguidor,
        idSeguido
    );

    if (!seguindo) {
        throw new AppError("Você não segue este usuário.", 404);
    }

    await seguidoresRepository.deixarDeSeguir(
        idSeguidor,
        idSeguido
    );
};

const listarSeguidores = async (idUsuario) => {

    const usuario = await seguidoresRepository.buscarUsuarioPorId(idUsuario);

    if (!usuario) {
        throw new AppError("Usuário não encontrado.", 404);
    }

    return await seguidoresRepository.listarSeguidores(idUsuario);
};

const listarSeguindo = async (idUsuario) => {

    const usuario = await seguidoresRepository.buscarUsuarioPorId(idUsuario);

    if (!usuario) {
        throw new AppError("Usuário não encontrado.", 404);
    }

    return await seguidoresRepository.listarSeguindo(idUsuario);
};

const verificarStatus = async (idSeguidor, idSeguido) => {

    const usuario = await seguidoresRepository.buscarUsuarioPorId(idSeguido);

    if (!usuario) {
        throw new AppError("Usuário não encontrado.", 404);
    }

    const seguindo = await seguidoresRepository.jaSegue(
        idSeguidor,
        idSeguido
    );

    return {
        seguindo: !!seguindo
    };
};

module.exports = {
    seguir,
    deixarDeSeguir,
    listarSeguidores,
    listarSeguindo,
    verificarStatus
};