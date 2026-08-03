const preferenciasRepo = require("../repositories/preferenciasNotificacoes.repository");

const getPreferencias = async (idUsuario) => {
    const preferenciasSalvas = await preferenciasRepo.findByUsuarioId(idUsuario);

    // Estado padrão (tudo true/1 caso não exista no banco)
    const preferencias = {
        email_like_post: true,
        email_novo_seguidor: true,
        email_login: true
    };

    // Sobrescreve o padrão com o que vier do banco de dados
    preferenciasSalvas.forEach(pref => {
        preferencias[pref.nome_configuracao] = pref.status === 1;
    });

    return preferencias;
};

const updatePreferencias = async (idUsuario, preferencias) => {
    // Itera sobre o objeto recebido e faz o upsert no banco
    for (const [key, value] of Object.entries(preferencias)) {
        const status = value === true ? 1 : 0;
        await preferenciasRepo.upsert(idUsuario, key, status);
    }
    
    return true;
};

module.exports = {
    getPreferencias,
    updatePreferencias
};