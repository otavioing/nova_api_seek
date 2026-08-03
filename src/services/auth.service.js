const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const AppError = require("../utils/AppError");
const usuarioRepository = require("../repositories/usuario.repository");

const authRepository = require("../repositories/auth.repository");

const sendEmail = require("../utils/sendEmail");
const preferenciasService = require("./preferenciasNotificacoes.service");

const login = async (email, senha) => {

    const usuario = await authRepository.findByEmail(email);

    if (!usuario) {
        throw new AppError(
            "Email ou senha inválidos.",
            401
        );
    }

    const senhaValida = await bcrypt.compare(
        senha,
        usuario.senha
    );

    if (!senhaValida) {
        throw new AppError(
            "Email ou senha inválidos.",
            401
        );
    }

    if (!senhaValida) {
        throw new AppError(
            "Email ou senha inválidos.",
            401
        );
    }

    if (usuario.banido === 1) {
        throw new AppError(
            "Acesso negado. Sua conta foi banida por violar os termos de uso da plataforma.",
            403 // 403 Forbidden
        );
    }

    if (usuario.conta_verificada === 0) {
        throw new AppError(
            "Conta não verificada. Por favor, valide o código enviado para o seu e-mail antes de fazer login.",
            403
        );
    }

    const token = jwt.sign(
        {
            id: usuario.id,
            email: usuario.email,
            tipo_usuario: usuario.tipo_usuario
        },
        process.env.JWT_SECRET,
        {
            expiresIn: process.env.JWT_EXPIRES
        }
    );

    delete usuario.senha;

    // --- DISPARO DE E-MAIL DE ALERTA DE LOGIN ---
    try {
        const preferencias = await preferenciasService.getPreferencias(usuario.id);

        if (preferencias.email_login === true) {
            
            const dataHora = new Date().toLocaleString("pt-BR", { 
                timeZone: "America/Sao_Paulo" 
            });

            await sendEmail({
                email: usuario.email,
                subject: "Novo acesso detectado na sua conta Seek",
                message: `Olá, ${usuario.nome}. Identificamos um novo login na sua conta em ${dataHora}. Se não foi você, recomendamos que altere sua senha imediatamente.`,
                html: `
                    <h2>Alerta de Login</h2>
                    <p>Olá, <strong>${usuario.nome}</strong>.</p>
                    <p>Identificamos que um novo acesso foi realizado na sua conta Seek no dia e horário: <strong>${dataHora}</strong>.</p>
                    <p>Se foi você, pode ignorar este e-mail.</p>
                    <p style="color: red;"><strong>Se não foi você, recomendamos que altere sua senha imediatamente na plataforma.</strong></p>
                `
            });
        }
    } catch (error) {
        console.error("Erro ao enviar e-mail de notificação de login:", error);
    }

    return {
        token,
        usuario
    };
};

const esqueciSenha = async (email) => {
    const usuario = await usuarioRepository.findByEmail(email);

    if (!usuario) return; 

    const codigoRecuperacao = Math.floor(100000 + Math.random() * 900000).toString();
    const expiracao = new Date(Date.now() + 15 * 60 * 1000);

    await usuarioRepository.updateCodigoVerificacao(usuario.id, codigoRecuperacao, expiracao);

    try {
        await sendEmail({
            email: usuario.email,
            subject: "Recuperação de Senha - Seek",
            message: `Olá ${usuario.nome}, seu código de recuperação de senha é: ${codigoRecuperacao}. Ele expira em 15 minutos.`,
            html: `
                <h2>Recuperação de Senha</h2>
                <p>Olá, <strong>${usuario.nome}</strong>.</p>
                <p>Você solicitou a redefinição da sua senha na plataforma Seek.</p>
                <p>Seu código de verificação é:</p>
                <h1 style="letter-spacing: 5px; color: #333;">${codigoRecuperacao}</h1>
                <p><em>Este código é válido por 15 minutos. Caso não tenha solicitado, ignore este e-mail.</em></p>
            `
        });
    } catch (error) {
        console.error("Erro ao enviar e-mail de recuperação de senha:", error);
        throw new AppError("Erro interno ao enviar o e-mail. Tente novamente mais tarde.", 500);
    }
}; 

const redefinirSenha = async (email, codigo, nova_senha) => {
    const usuario = await usuarioRepository.findByEmail(email);

    if (!usuario) {
        throw new AppError("Dados inválidos.", 400);
    }

    if (usuario.codigo_verificacao !== codigo) {
        throw new AppError("Código de verificação inválido.", 400);
    }

    if (new Date() > new Date(usuario.expiracao_codigo)) {
        throw new AppError("Código expirado. Solicite um novo código de recuperação.", 400);
    }

    const senhaHash = await bcrypt.hash(nova_senha, 10);

    await authRepository.updateSenha(usuario.id, senhaHash);

    await usuarioRepository.updateCodigoVerificacao(usuario.id, null, null);

    try {
        await sendEmail({
            email: usuario.email,
            subject: "Sua senha foi alterada - Seek",
            message: `Olá ${usuario.nome}, sua senha foi alterada com sucesso. Se você não realizou esta alteração, entre em contato com o suporte imediatamente.`,
            html: `
                <h2>Senha Alterada com Sucesso</h2>
                <p>Olá, <strong>${usuario.nome}</strong>.</p>
                <p>Confirmamos que a senha da sua conta na plataforma Seek foi alterada com sucesso.</p>
                <p style="color: red;"><strong>Se você não realizou esta alteração, recomendamos alterar sua senha novamente ou entrar em contato com nosso suporte imediatamente.</strong></p>
            `
        });
    } catch (error) {
        console.error("Erro ao enviar e-mail de confirmação de alteração de senha:", error);
    }
};

module.exports = {
    login,
    esqueciSenha,
    redefinirSenha
};