const bcrypt = require("bcrypt");
const AppError = require("../utils/AppError");
const usuarioRepository = require("../repositories/usuario.repository");
const sendEmail = require("../utils/sendEmail");

const create = async (dados) => {

    const emailExiste = await usuarioRepository.findByEmail(dados.email);
    if (emailExiste) {
        throw new AppError("Este email já está cadastrado.", 409);
    }

    if (dados.tipo_usuario === "EMPRESA") {
        const cnpjExiste = await usuarioRepository.findByCnpj(dados.cnpj);
        if (cnpjExiste) {
            throw new AppError("Este CNPJ já está cadastrado.", 409);
        }
    }

    const senhaHash = await bcrypt.hash(dados.senha, 10);

    // 1. Gera código de 6 dígitos e expiração (agora + 15 min)
    const codigoVerificacao = Math.floor(100000 + Math.random() * 900000).toString();
    const dataExpiracao = new Date(Date.now() + 15 * 60 * 1000);

    const id = await usuarioRepository.create({
        ...dados,
        senha: senhaHash,
        codigo_verificacao: codigoVerificacao,
        expiracao_codigo: dataExpiracao
    });

    try {
        await sendEmail({
            email: dados.email,
            subject: "Verifique sua conta na Seek",
            message: `Olá ${dados.nome}, seu código de verificação é: ${codigoVerificacao}. Ele expira em 15 minutos.`,
            html: `
                <h2>Bem-vindo(a) à Seek!</h2>
                <p>Olá, ${dados.nome}. Falta pouco para começar.</p>
                <p>Seu código de verificação é:</p>
                <h1 style="letter-spacing: 5px; color: #333;">${codigoVerificacao}</h1>
                <p><em>Este código é válido por 15 minutos.</em></p>
            `
        });
    } catch (error) {
        console.error("Erro ao enviar e-mail de verificação:", error);
    }

    return {
        id,
        nome: dados.nome,
        email: dados.email,
        tipo_usuario: dados.tipo_usuario,
        mensagem: "Conta criada. Verifique seu e-mail para ativar a conta."
    };
};

const verificarCodigo = async (email, codigo) => {
    
    const usuario = await usuarioRepository.findByEmail(email);

    if (!usuario) {
        throw new AppError("Usuário não encontrado.", 404);
    }

    if (usuario.conta_verificada === 1) {
        throw new AppError("Esta conta já foi verificada.", 400);
    }

    if (usuario.codigo_verificacao !== codigo) {
        throw new AppError("Código de verificação inválido.", 400);
    }

    if (new Date() > new Date(usuario.expiracao_codigo)) {
        throw new AppError("Código expirado. Solicite um novo código.", 400);
    }

    await usuarioRepository.updateVerificacao(usuario.id);

    return;
};

const reenviarCodigo = async (email) => {
    const usuario = await usuarioRepository.findByEmail(email);

    if (!usuario) {
        throw new AppError("Usuário não encontrado.", 404);
    }

    if (usuario.conta_verificada === 1) {
        throw new AppError("Esta conta já está verificada. Você já pode fazer login.", 400);
    }

    // Gera um novo código e nova validade (mais 15 minutos)
    const novoCodigo = Math.floor(100000 + Math.random() * 900000).toString();
    const novaExpiracao = new Date(Date.now() + 15 * 60 * 1000);

    // Atualiza no banco de dados
    await usuarioRepository.updateCodigoVerificacao(usuario.id, novoCodigo, novaExpiracao);

    // Dispara o novo e-mail
    // Neste caso, se o e-mail falhar, disparamos um erro para o front-end saber
    try {
        await sendEmail({
            email: usuario.email,
            subject: "Seu novo código de verificação - Seek",
            message: `Olá ${usuario.nome}, você solicitou um novo código: ${novoCodigo}. Ele expira em 15 minutos.`,
            html: `
                <h2>Olá, ${usuario.nome}.</h2>
                <p>Você solicitou um novo código de verificação para sua conta.</p>
                <p>Seu novo código é:</p>
                <h1 style="letter-spacing: 5px; color: #333;">${novoCodigo}</h1>
                <p><em>Este código é válido por 15 minutos.</em></p>
            `
        });
    } catch (error) {
        console.error("Erro ao reenviar e-mail de verificação:", error);
        throw new AppError("Erro ao enviar o e-mail. Tente novamente mais tarde.", 500);
    }

    return;
};

const verificarPrimeiroLogin = async (idUsuario) => {

    const usuario =
        await usuarioRepository.findCadastroCompleto(
            idUsuario
        );

    if (!usuario) {
        throw new AppError(
            "Usuário não encontrado.",
            404
        );
    }

    return {
        primeiro_login:
            usuario.cadastro_completo === 0
    };
};

const completarCadastro = async (idUsuario) => {

    const usuario =
        await usuarioRepository.findById(
            idUsuario
        );

    if (!usuario) {
        throw new AppError(
            "Usuário não encontrado.",
            404
        );
    }

    await usuarioRepository.updateCadastroCompleto(
        idUsuario
    );

    return;
};

const getPaginaUsuario = async (
    idUsuario,
    idUsuarioToken = null
) => {

    const usuario =
        await usuarioRepository.findPaginaById(
            idUsuario
        );

    if (!usuario) {
        throw new AppError(
            "Usuário não encontrado.",
            404
        );
    }

    return {
        nome:
            usuario.nome,
        descricao:
            usuario.descricao,
        foto:
            usuario.foto_perfil,
        banner:
            usuario.banner_perfil,
        tipo_usuario:
            usuario.tipo_usuario,
        total_seguidores:
            usuario.total_seguidores,
        total_seguindo:
            usuario.total_seguindo,
        total_posts:
            usuario.total_posts,
        edit:
            Number(idUsuarioToken) === Number(idUsuario)
    };
};

const updateFotoPerfil = async (
    usuarioId,
    caminho
) => {

    return await usuarioRepository.updateFotoPerfil(
        usuarioId,
        caminho
    );
};

const updateBannerPerfil = async (
    usuarioId,
    caminho
) => {

    return await usuarioRepository.updateBannerPerfil(
        usuarioId,
        caminho
    );
};

const validarTipoUsuario = async (
    usuarioId,
    tipoEsperado
) => {

    const usuario = await usuarioRepository.findById(usuarioId);

    if (!usuario) {
        throw new AppError(
            "Usuário não encontrado.",
            404
        );
    }

    if (usuario.tipo_usuario !== tipoEsperado) {
        throw new AppError(
            `Esta rota é exclusiva para usuários do tipo ${tipoEsperado}.`,
            403
        );
    }
};

const updatePerfilEmpresa = async (
    usuarioId,
    dados
) => {

    await validarTipoUsuario(usuarioId, "EMPRESA");

    return await usuarioRepository.updatePerfilEmpresa(
        usuarioId,
        dados
    );
};

const updatePerfilPessoaFisica = async (
    usuarioId,
    dados
) => {

    await validarTipoUsuario(usuarioId, "PF");

    return await usuarioRepository.updatePerfilPessoaFisica(
        usuarioId,
        dados
    );
};

const getPerfis = async (usuarioId) => {

    const usuario = await usuarioRepository.findPerfisByUsuarioId(
        usuarioId
    );

    if (!usuario) {
        throw new AppError(
            "Usuário não encontrado.",
            404
        );
    }

    return {
        id: usuario.id,
        tipo_usuario: usuario.tipo_usuario,
        perfil_empresa: usuario.perfil_empresa_id === null ? null : {
            razao_social: usuario.razao_social,
            nome_fantasia: usuario.nome_fantasia,
            telefone_comercial: usuario.telefone_comercial,
            categoria_negocio: usuario.categoria_negocio,
            numero_funcionarios: usuario.numero_funcionarios,
            endereco_completo: usuario.endereco_completo,
            descricao: usuario.descricao,
            site: usuario.site
        },
        perfil_pessoa_fisica: usuario.perfil_pessoa_fisica_id === null ? null : {
            nome_usuario: usuario.nome_usuario,
            telefone: usuario.telefone,
            cidade: usuario.cidade,
            estado: usuario.estado,
            sobre: usuario.sobre,
            linkedin: usuario.linkedin,
            github: usuario.github,
            curriculo: usuario.curriculo
        }
    };
};

const pesquisarUsuarios = async (
    termo,
    idUsuarioToken = null,
    salvarNoHistorico = true
) => {

    const usuarios =
        await usuarioRepository.searchByNomeOrEmail(
            termo
        );

    if (
        idUsuarioToken &&
        usuarios.length > 0 &&
        salvarNoHistorico
    ) {
        await usuarioRepository.createHistoricoPesquisa(
            idUsuarioToken,
            termo
        );
    }

    return usuarios;
};

const getUltimasPesquisas = async (idUsuario) => {

    const usuario = await usuarioRepository.findById(idUsuario);

    if (!usuario) {
        throw new AppError("Usuário não encontrado.", 404);
    }

    return await usuarioRepository.findUltimasPesquisasByUsuarioId(
        idUsuario,
        5
    );
};

const deleteHistoricoPesquisa = async (
    idHistorico,
    idUsuario
) => {

    const historico =
        await usuarioRepository.findHistoricoPesquisaById(
            idHistorico
        );

    if (!historico) {
        throw new AppError(
            "Pesquisa não encontrada.",
            404
        );
    }

    if (Number(historico.id_usuario) !== Number(idUsuario)) {
        throw new AppError(
            "Você não tem permissão para excluir esta pesquisa.",
            403
        );
    }

    await usuarioRepository.deleteHistoricoPesquisaById(
        idHistorico
    );

    return;
};


module.exports = {
    create,
    verificarCodigo,
    reenviarCodigo,
    verificarPrimeiroLogin,
    completarCadastro,
    getPaginaUsuario,
    updateFotoPerfil,
    updateBannerPerfil,
    updatePerfilEmpresa,
    updatePerfilPessoaFisica,
    getPerfis,
    pesquisarUsuarios,
    getUltimasPesquisas,
    deleteHistoricoPesquisa
};
