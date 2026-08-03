const db = require("../config/database");

const findByUsuarioId = async (idUsuario) => {
    const [rows] = await db.query(
        `SELECT nome_configuracao, status 
         FROM preferencias_notificacoes 
         WHERE id_usuario = ?`,
        [idUsuario]
    );
    return rows;
};

const upsert = async (idUsuario, nomeConfiguracao, status) => {
    // O MySQL tenta inserir. Se violar a chave única (mesmo usuário e mesma configuração), ele faz o update do status.
    const query = `
        INSERT INTO preferencias_notificacoes (id_usuario, nome_configuracao, status) 
        VALUES (?, ?, ?) 
        ON DUPLICATE KEY UPDATE status = VALUES(status)
    `;
    
    await db.query(query, [idUsuario, nomeConfiguracao, status]);
};

module.exports = {
    findByUsuarioId,
    upsert
};