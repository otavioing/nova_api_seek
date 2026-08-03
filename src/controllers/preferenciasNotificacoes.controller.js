const service = require("../services/preferenciasNotificacoes.service");
const response = require("../utils/response");

const get = async (req, res, next) => {
    try {
        const idUsuario = req.user.id; // Vem do auth.middleware.js
        const preferencias = await service.getPreferencias(idUsuario);

        return response.success(
            res, 
            "Preferências recuperadas com sucesso.", 
            preferencias
        );
    } catch (error) {
        next(error);
    }
};

const update = async (req, res, next) => {
    try {
        const idUsuario = req.user.id;
        const { preferencias } = req.body;

        await service.updatePreferencias(idUsuario, preferencias);

        return response.success(
            res, 
            "Preferências de notificação atualizadas com sucesso."
        );
    } catch (error) {
        next(error);
    }
};

module.exports = {
    get,
    update
};