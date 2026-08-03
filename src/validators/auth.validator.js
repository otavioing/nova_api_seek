const AppError = require("../utils/AppError");

const login = (req, res, next) => {

    const { email, senha } = req.body;

    const errors = [];

    if (!email) {
        errors.push({
            campo: "email",
            mensagem: "Email é obrigatório."
        });
    }

    if (!senha) {
        errors.push({
            campo: "senha",
            mensagem: "Senha é obrigatória."
        });
    }

    if (errors.length > 0) {
        return next(
            new AppError(
                errors[0].mensagem,
                400,
                errors
            )
        );
    }

    next();
};

const esqueciSenha = (req, res, next) => {
    const { email } = req.body;
    const errors = [];

    if (!email) {
        errors.push({ campo: "email", mensagem: "O email é obrigatório." });
    }

    if (errors.length > 0) {
        return next(new AppError(errors[0].mensagem, 400, errors));
    }

    next();
};

const redefinirSenha = (req, res, next) => {
    const { email, codigo, nova_senha } = req.body;
    const errors = [];

    if (!email) {
        errors.push({ campo: "email", mensagem: "O email é obrigatório." });
    }
    if (!codigo) {
        errors.push({ campo: "codigo", mensagem: "O código de verificação é obrigatório." });
    } else if (codigo.length !== 6) {
        errors.push({ campo: "codigo", mensagem: "O código deve ter 6 dígitos." });
    }
    if (!nova_senha) {
        errors.push({ campo: "nova_senha", mensagem: "A nova senha é obrigatória." });
    }

    if (errors.length > 0) {
        return next(new AppError(errors[0].mensagem, 400, errors));
    }

    next();
};

module.exports = {
    login,
    esqueciSenha,
    redefinirSenha
};