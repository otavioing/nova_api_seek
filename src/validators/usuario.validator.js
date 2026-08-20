const AppError = require("../utils/AppError");

const create = (req, res, next) => {

    const {
        tipo_usuario,
        nome,
        email,
        senha,
        cnpj
    } = req.body;

    const errors = [];

    if (!tipo_usuario) {
        errors.push({
            campo: "tipo_usuario",
            mensagem: "Tipo de usuário é obrigatório."
        });
    }

    if (
        tipo_usuario &&
        !["PF", "EMPRESA"].includes(tipo_usuario)
    ) {
        errors.push({
            campo: "tipo_usuario",
            mensagem: "Tipo de usuário inválido."
        });
    }

    if (!nome) {
        errors.push({
            campo: "nome",
            mensagem: "Nome é obrigatório."
        });
    }

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

    if (
        tipo_usuario === "EMPRESA" &&
        !cnpj
    ) {
        errors.push({
            campo: "cnpj",
            mensagem: "CNPJ é obrigatório para empresas."
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

const verificar = (req, res, next) => {
    const { email, codigo } = req.body;
    const errors = [];

    if (!email) {
        errors.push({ campo: "email", mensagem: "Email é obrigatório." });
    }

    if (!codigo) {
        errors.push({ campo: "codigo", mensagem: "O código de verificação é obrigatório." });
    } else if (codigo.length !== 6) {
        errors.push({ campo: "codigo", mensagem: "O código deve ter 6 dígitos." });
    }

    if (errors.length > 0) {
        return next(new AppError(errors[0].mensagem, 400, errors));
    }

    next();
};

const reenviarCodigo = (req, res, next) => {
    const { email } = req.body;
    const errors = [];

    if (!email) {
        errors.push({ campo: "email", mensagem: "O email é obrigatório para reenviar o código." });
    }

    if (errors.length > 0) {
        return next(new AppError(errors[0].mensagem, 400, errors));
    }

    next();
};

const pesquisar = (req, res, next) => {
    const termo =
        req.query?.termo ??
        req.body?.termo;
    const errors = [];

    if (!termo || typeof termo !== "string" || !termo.trim()) {
        errors.push({
            campo: "termo",
            mensagem: "O termo de pesquisa é obrigatório."
        });
    }

    if (errors.length > 0) {
        return next(new AppError(errors[0].mensagem, 400, errors));
    }

    next();
};

module.exports = {
    create,
    verificar,
    reenviarCodigo,
    pesquisar
};