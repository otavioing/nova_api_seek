const db = require("../config/database");


const findById = async (id) => {

    const [rows] = await db.query(
        `
        SELECT id
        FROM usuarios
        WHERE id = ?
        LIMIT 1
        `,
        [id]
    );

    return rows[0] || null;
};

const findByEmail = async (email) => {

    const [rows] = await db.query(
        `
        SELECT *
        FROM usuarios
        WHERE email = ?
        LIMIT 1
        `,
        [email]
    );

    return rows[0] || null;
};

const findByCnpj = async (cnpj) => {

    const [rows] = await db.query(
        `
        SELECT *
        FROM usuarios
        WHERE cnpj = ?
        LIMIT 1
        `,
        [cnpj]
    );

    return rows[0] || null;
};

const create = async (dados) => {
    const query = `
        INSERT INTO usuarios 
        (tipo_usuario, nome, email, senha, cnpj, codigo_verificacao, expiracao_codigo) 
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    
    const [result] = await db.query(query, [
        dados.tipo_usuario,
        dados.nome,
        dados.email,
        dados.senha,
        dados.cnpj || null,
        dados.codigo_verificacao,
        dados.expiracao_codigo
    ]);

    return result.insertId;
};

const updateVerificacao = async (idUsuario) => {
    const query = `
        UPDATE usuarios 
        SET conta_verificada = 1, 
            codigo_verificacao = NULL, 
            expiracao_codigo = NULL 
        WHERE id = ?
    `;
    
    await db.query(query, [idUsuario]);
};

const updateCodigoVerificacao = async (idUsuario, novoCodigo, novaExpiracao) => {
    const query = `
        UPDATE usuarios 
        SET codigo_verificacao = ?, 
            expiracao_codigo = ? 
        WHERE id = ?
    `;
    
    await db.query(query, [novoCodigo, novaExpiracao, idUsuario]);
};

const findCadastroCompleto = async (id) => {

    const [rows] = await db.query(
        `
        SELECT
            cadastro_completo
        FROM usuarios
        WHERE id = ?
        LIMIT 1
        `,
        [id]
    );

    return rows[0] || null;
};

const updateCadastroCompleto = async (idUsuario) => {

    const [result] = await db.query(
        `
        UPDATE usuarios
        SET cadastro_completo = 1
        WHERE id = ?
        `,
        [idUsuario]
    );

    return result;
};

const updateFotoPerfil = async (
    usuarioId,
    caminho
) => {

    const [result] = await banco.query(
        `
        UPDATE usuarios
        SET foto_perfil = ?
        WHERE id = ?
        `,
        [caminho, usuarioId]
    );

    return result;
};

const updateBannerPerfil = async (
    usuarioId,
    caminho
) => {

    const [result] = await banco.query(
        `
        UPDATE usuarios
        SET banner_perfil = ?
        WHERE id = ?
        `,
        [caminho, usuarioId]
    );

    return result;
};

module.exports = {
    create,
    updateVerificacao,
    updateCodigoVerificacao,
    findByEmail,
    findByCnpj,
    findById,
    findCadastroCompleto,
    updateCadastroCompleto,
    updateFotoPerfil,
    updateBannerPerfil
};
