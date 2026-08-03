const usuarioService = require(
    "../services/usuario.service"
);

const response = require(
    "../utils/response"
);

const create = async (
    req,
    res,
    next
) => {

    try {

        const usuario =
            await usuarioService.create(
                req.body
            );

        return response.success(
            res,
            "Usuário cadastrado com sucesso.",
            usuario,
            null,
            201
        );

    } catch (error) {
        next(error);
    }

};

const verificarConta = async (req, res, next) => {
    try {
        const { email, codigo } = req.body;

        await usuarioService.verificarCodigo(email, codigo);

        return response.success(
            res,
            "Conta verificada com sucesso. Você já pode fazer login."
        );
    } catch (error) {
        next(error);
    }
};

const reenviarCodigo = async (req, res, next) => {
    try {
        const { email } = req.body;

        await usuarioService.reenviarCodigo(email);

        return response.success(
            res,
            "Novo código enviado com sucesso. Verifique sua caixa de entrada."
        );
    } catch (error) {
        next(error);
    }
};

const verificarPrimeiroLogin = async (
    req,
    res,
    next
) => {

    try {

        const resultado =
            await usuarioService.verificarPrimeiroLogin(
                req.user.id
            );

        return response.success(
            res,
            "Verificação realizada com sucesso.",
            resultado
        );

    } catch (error) {
        next(error);
    }

};

const completarCadastro = async (
    req,
    res,
    next
) => {

    try {

        await usuarioService.completarCadastro(
            req.user.id
        );

        return response.success(
            res,
            "Cadastro completado com sucesso."
        );

    } catch (error) {
        next(error);
    }

};

const uploadFotoPerfil = async (
    req,
    res,
    next
) => {

    try {

        const { id } = req.params;

        if (!req.file) {
            return response.error(
                res,
                "Nenhuma imagem enviada."
            );
        }

        const caminho = `/uploads/perfil/${req.file.filename}`;

        await usuarioService.updateFotoPerfil(
            id,
            caminho
        );

        return response.success(
            res,
            "Foto de perfil atualizada com sucesso.",
            {
                foto_perfil: caminho
            }
        );

    } catch (error) {
        next(error);
    }
};

const uploadBannerPerfil = async (
    req,
    res,
    next
) => {

    try {

        const { id } = req.params;

        if (!req.file) {
            return response.error(
                res,
                "Nenhuma imagem enviada."
            );
        }

        const caminho = `/uploads/banner/${req.file.filename}`;

        await usuarioService.updateBannerPerfil(
            id,
            caminho
        );

        return response.success(
            res,
            "Banner atualizado com sucesso.",
            {
                banner_perfil: caminho
            }
        );

    } catch (error) {
        next(error);
    }
};

module.exports = {
    create,
    verificarConta,
    reenviarCodigo,
    verificarPrimeiroLogin,
    completarCadastro,
    uploadFotoPerfil,
    uploadBannerPerfil
};