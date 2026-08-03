const db = require("../config/database");

const create = async (dados) => {
    const { id_usuario, tipo, titulo, mensagem } = dados;
    const [result] = await db.query(
        `INSERT INTO notificacoes (id_usuario, tipo, titulo, mensagem) 
         VALUES (?, ?, ?, ?)`,
        [id_usuario, tipo, titulo, mensagem]
    );
    return result.insertId;
};

// Retorna todas as notificações incluindo a coluna 'lida' (0 = Não lida, 1 = Lida)
const findByUsuarioId = async (idUsuario) => {
    const [rows] = await db.query(
        `SELECT id, tipo, titulo, mensagem, lida, data_criacao 
         FROM notificacoes 
         WHERE id_usuario = ? 
         ORDER BY data_criacao DESC`,
        [idUsuario]
    );
    return rows;
};

// Verifica se a notificação existe e pertence ao usuário (segurança)
const findByIdAndUsuario = async (id, idUsuario) => {
    const [rows] = await db.query(
        `SELECT id FROM notificacoes WHERE id = ? AND id_usuario = ?`,
        [id, idUsuario]
    );
    return rows[0];
};

const markAsRead = async (id) => {
    await db.query(
        `UPDATE notificacoes SET lida = 1 WHERE id = ?`,
        [id]
    );
};

const deleteById = async (id) => {
    await db.query(
        `DELETE FROM notificacoes WHERE id = ?`,
        [id]
    );
};

const deleteAllByUsuarioId = async (idUsuario) => {
    await db.query(
        `DELETE FROM notificacoes WHERE id_usuario = ?`,
        [idUsuario]
    );
};

module.exports = {
    create,
    findByUsuarioId,
    findByIdAndUsuario,
    markAsRead,
    deleteById,
    deleteAllByUsuarioId
};