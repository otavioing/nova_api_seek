const db = require("../config/database");

const findConversaEntreUsuarios = async (idUsuario1, idUsuario2) => {
    const [rows] = await db.query(
        `
        SELECT cp1.id_conversa 
        FROM conversa_participantes cp1
        JOIN conversa_participantes cp2 ON cp1.id_conversa = cp2.id_conversa
        WHERE cp1.id_usuario = ? AND cp2.id_usuario = ?
        LIMIT 1
        `,
        [idUsuario1, idUsuario2]
    );
    return rows[0] || null;
};

const createConversa = async () => {
    const [result] = await db.query(
        `INSERT INTO conversas () VALUES ()`
    );
    return result.insertId;
};

const addParticipante = async (idConversa, idUsuario) => {
    await db.query(
        `
        INSERT INTO conversa_participantes (id_conversa, id_usuario) 
        VALUES (?, ?)
        `,
        [idConversa, idUsuario]
    );
};

const createMensagem = async (idConversa, idRemetente, mensagem) => {
    const [result] = await db.query(
        `
        INSERT INTO mensagens (id_conversa, id_remetente, mensagem) 
        VALUES (?, ?, ?)
        `,
        [idConversa, idRemetente, mensagem]
    );
    return result.insertId;
};

const findConversasDoUsuario = async (idUsuario) => {
    const [rows] = await db.query(
        `
        SELECT 
            c.id AS id_conversa,
            u.id AS id_destinatario,
            u.nome AS nome_destinatario,
            u.foto_perfil,
            m.mensagem AS ultima_mensagem,
            m.data_envio AS data_ultima_mensagem
        FROM conversas c
        JOIN conversa_participantes cp1 ON c.id = cp1.id_conversa
        JOIN conversa_participantes cp2 ON c.id = cp2.id_conversa AND cp2.id_usuario != cp1.id_usuario
        JOIN usuarios u ON cp2.id_usuario = u.id
        LEFT JOIN mensagens m ON m.id = (
            SELECT id FROM mensagens 
            WHERE id_conversa = c.id 
            ORDER BY data_envio DESC LIMIT 1
        )
        WHERE cp1.id_usuario = ?
        ORDER BY m.data_envio DESC
        `,
        [idUsuario]
    );
    return rows;
};

const findMensagensDaConversa = async (idConversa) => {
    const [rows] = await db.query(
        `
        SELECT id, id_remetente, mensagem, data_envio 
        FROM mensagens
        WHERE id_conversa = ?
        ORDER BY data_envio ASC
        `,
        [idConversa]
    );
    return rows;
};

const findConversaById = async (idConversa, idUsuario) => {
    const [rows] = await db.query(
        `
        SELECT id_conversa 
        FROM conversa_participantes 
        WHERE id_conversa = ? AND id_usuario = ?
        LIMIT 1
        `,
        [idConversa, idUsuario]
    );
    return rows[0] || null;
};

module.exports = {
    findConversaEntreUsuarios,
    createConversa,
    addParticipante,
    createMensagem,
    findConversasDoUsuario,
    findMensagensDaConversa,
    findConversaById
};