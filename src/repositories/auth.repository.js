const db = require("../config/database");

const findByEmail = async (email) => {

    const [rows] = await db.query(
        `
        SELECT
            id,
            tipo_usuario,
            nome,
            email,
            senha,
            foto_perfil,
            banner_perfil,
            cnpj,
            conta_verificada,
            banido 
        FROM usuarios
        WHERE email = ?
        LIMIT 1
        `,
        [email]
    );

    return rows[0] || null;
};
const findById = async (id) => {

    const [rows] = await db.query(
        `
        SELECT
            id,
            tipo_usuario,
            nome,
            email,
            foto_perfil,
            banner_perfil,
            cnpj,
            conta_verificada,
            banido
        FROM usuarios
        WHERE id = ?
        LIMIT 1
        `,
        [id]
    );

    return rows[0] || null;
};

const updateSenha = async (idUsuario, novaSenhaHash) => {
    const query = `
        UPDATE usuarios 
        SET senha = ? 
        WHERE id = ?
    `;
    
    await db.query(query, [novaSenhaHash, idUsuario]);
};

module.exports = {
    findByEmail,
    findById,
    updateSenha
};