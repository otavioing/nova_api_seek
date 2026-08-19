const authService = require(
    "../services/auth.service"
);

const response = require(
    "../utils/response"
);

const authRepository = require(
    "../repositories/auth.repository"
);

const { montarUrlArquivo } = require("../utils/fileUrl");


const login = async (
    req,
    res,
    next
) => {

    try {

        const { email, senha } = req.body;

        const resultado =
            await authService.login(
                email,
                senha
            );

        res.cookie("token", resultado.token, {
            httpOnly: true,
            secure: false,
            sameSite: "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000,
            path: "/"
        });

        return response.success(
            res,
            "Login realizado com sucesso.",
            {
                usuario: resultado.usuario
            }
        );

    } catch (error) {
        next(error);
    }

};

const logout = async (req, res, next) => {
    try {
        res.clearCookie("token", {
            httpOnly: true,
            secure: false,
            sameSite: "lax",
            path: "/"
        });

        return response.success(
            res,
            "Logout realizado com sucesso."
        );

    } catch (error) {
        next(error);
    }
};

const me = async (req, res, next) => {
    try {
        const usuario = await authRepository.findById(req.user.id);

        if (!usuario) {
            return res.status(404).json({
                success: false,
                message: "Usuário não encontrado."
            });
        }

        usuario.foto_perfil = montarUrlArquivo(
            req,
            usuario.foto_perfil,
            usuario.banner_perfil
        );
        usuario.banner_perfil = montarUrlArquivo(
            req,
            usuario.banner_perfil
        );

        return response.success(
            res,
            "Usuário autenticado.",
            {
                usuario
            }
        );

    } catch (error) {
        next(error);
    }
};

const idUsuario = async (req, res, next) => {
    try {
        return response.success(
            res,
            "ID do usuário autenticado carregado com sucesso.",
            {
                id: req.user.id
            }
        );
    } catch (error) {
        next(error);
    }
};

const esqueciSenha = async (req, res, next) => {
    try {
        const { email } = req.body;
        
        await authService.esqueciSenha(email);

        return response.success(
            res,
            "Se o e-mail estiver cadastrado, um código de recuperação será enviado."
        );
    } catch (error) {
        next(error);
    }
};

const redefinirSenha = async (req, res, next) => {
    try {
        const { email, codigo, nova_senha } = req.body;
        
        await authService.redefinirSenha(email, codigo, nova_senha);

        return response.success(
            res,
            "Senha redefinida com sucesso. Você já pode fazer login com a nova senha."
        );
    } catch (error) {
        next(error);
    }
};

module.exports = {
    login,
    logout,
    me,
    idUsuario,
    esqueciSenha,
    redefinirSenha
};