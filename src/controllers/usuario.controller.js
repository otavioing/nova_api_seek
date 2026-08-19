const usuarioService = require(
    "../services/usuario.service"
);

const jwt = require("jsonwebtoken");

const response = require(
    "../utils/response"
);

const {
    montarUrlArquivo
} = require("../utils/fileUrl");

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

const getPaginaUsuario = async (
    req,
    res,
    next
) => {

    try {

        const { id } = req.params;
        let idUsuarioToken = null;

        if (req.cookies?.token) {
            try {
                const decoded = jwt.verify(
                    req.cookies.token,
                    process.env.JWT_SECRET
                );

                idUsuarioToken = decoded.id;
            } catch (error) {
                idUsuarioToken = null;
            }
        }

        const usuario =
            await usuarioService.getPaginaUsuario(
                id,
                idUsuarioToken
            );

        usuario.foto =
            montarUrlArquivo(
                req,
                usuario.foto
            );

        usuario.banner =
            montarUrlArquivo(
                req,
                usuario.banner
            );

        return response.success(
            res,
            "Página do usuário carregada com sucesso.",
            usuario
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
    getPaginaUsuario,
    uploadFotoPerfil,
    uploadBannerPerfil
};
