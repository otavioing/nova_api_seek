const seguidoresService = require("../services/seguidores.service");
const response = require("../utils/response");

const seguir = async (req, res, next) => {

    try {

        const idSeguidor = req.user.id;
        const idSeguido = Number(req.params.id);

        await seguidoresService.seguir(
            idSeguidor,
            idSeguido
        );

        return response.success(
            res,
            "Usuário seguido com sucesso."
        );

    } catch (error) {
        next(error);
    }

};

const deixarDeSeguir = async (req, res, next) => {

    try {

        const idSeguidor = req.user.id;
        const idSeguido = Number(req.params.id);

        await seguidoresService.deixarDeSeguir(
            idSeguidor,
            idSeguido
        );

        return response.success(
            res,
            "Usuário deixado de seguir com sucesso."
        );

    } catch (error) {
        next(error);
    }

};

const listarSeguidores = async (req, res, next) => {

    try {

        const idUsuario = Number(req.params.id);

        const seguidores = await seguidoresService.listarSeguidores(
            idUsuario
        );

        return response.success(
            res,
            "Seguidores encontrados.",
            seguidores,
            seguidores.length
        );

    } catch (error) {
        next(error);
    }

};

const listarSeguindo = async (req, res, next) => {

    try {

        const idUsuario = Number(req.params.id);

        const seguindo = await seguidoresService.listarSeguindo(
            idUsuario
        );

        return response.success(
            res,
            "Usuários seguidos encontrados.",
            seguindo,
            seguindo.length
        );

    } catch (error) {
        next(error);
    }

};

const verificarStatus = async (req, res, next) => {

    try {

        const idSeguidor = req.user.id;
        const idSeguido = Number(req.params.id);

        const status = await seguidoresService.verificarStatus(
            idSeguidor,
            idSeguido
        );

        return response.success(
            res,
            "Status encontrado.",
            status
        );

    } catch (error) {
        next(error);
    }

};

module.exports = {
    seguir,
    deixarDeSeguir,
    listarSeguidores,
    listarSeguindo,
    verificarStatus
};