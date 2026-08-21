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

const findPaginaById = async (id) => {

    const [rows] = await db.query(
        `
        SELECT
            u.id,
            u.nome,
            COALESCE(ppf.sobre, pe.descricao) AS descricao,
            u.foto_perfil,
            u.banner_perfil,
            u.tipo_usuario,

            (
                SELECT COUNT(*)
                FROM seguidores s
                WHERE s.id_seguido = u.id
            ) AS total_seguidores,

            (
                SELECT COUNT(*)
                FROM seguidores s
                WHERE s.id_seguidor = u.id
            ) AS total_seguindo,

            (
                SELECT COUNT(*)
                FROM posts p
                WHERE p.id_usuario = u.id
                AND p.status = 'ATIVO'
            ) AS total_posts

        FROM usuarios u

        LEFT JOIN perfis_pessoa_fisica ppf
            ON ppf.usuario_id = u.id

        LEFT JOIN perfis_empresa pe
            ON pe.usuario_id = u.id

        WHERE u.id = ?
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

const searchByNomeOrEmail = async (termo) => {

    const termoPesquisa = `%${termo.trim()}%`;

    const [rows] = await db.query(
        `
        SELECT
            u.id,
            u.nome,
            u.email,
            u.tipo_usuario,
            u.foto_perfil
        FROM usuarios u
        WHERE (
            u.nome LIKE ?
            OR u.email LIKE ?
        )
        AND NOT EXISTS (
            SELECT 1
            FROM preferencias_privacidade pp
            WHERE pp.id_usuario = u.id
            AND pp.nome_configuracao = 'ocultar_pesquisa'
            AND pp.status = 1
        )
        ORDER BY u.nome ASC
        `,
        [termoPesquisa, termoPesquisa]
    );

    return rows;
};

const createHistoricoPesquisa = async (
    idUsuario,
    termoPesquisa
) => {

    const termoNormalizado = termoPesquisa.trim();

    const [updateResult] = await db.query(
        `
        UPDATE historico_pesquisas
        SET data_pesquisa = CURRENT_TIMESTAMP
        WHERE id_usuario = ?
        AND termo_pesquisa = ?
        ORDER BY id DESC
        LIMIT 1
        `,
        [idUsuario, termoNormalizado]
    );

    if (updateResult.affectedRows > 0) {
        return updateResult;
    }

    const [result] = await db.query(
        `
        INSERT INTO historico_pesquisas
        (
            id_usuario,
            termo_pesquisa
        )
        VALUES
        (?, ?)
        `,
        [idUsuario, termoNormalizado]
    );

    return result.insertId;
};

const findUltimasPesquisasByUsuarioId = async (
    idUsuario,
    limite = 5
) => {

    const [rows] = await db.query(
        `
        SELECT
            id,
            termo_pesquisa,
            data_pesquisa
        FROM historico_pesquisas
        WHERE id_usuario = ?
        ORDER BY data_pesquisa DESC
        LIMIT ?
        `,
        [idUsuario, Number(limite)]
    );

    return rows;
};

const findHistoricoPesquisaById = async (id) => {

    const [rows] = await db.query(
        `
        SELECT
            id,
            id_usuario
        FROM historico_pesquisas
        WHERE id = ?
        LIMIT 1
        `,
        [id]
    );

    return rows[0] || null;
};

const deleteHistoricoPesquisaById = async (id) => {

    const [result] = await db.query(
        `
        DELETE FROM historico_pesquisas
        WHERE id = ?
        `,
        [id]
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
    findPaginaById,
    updateCadastroCompleto,
    updateFotoPerfil,
    updateBannerPerfil,
    searchByNomeOrEmail,
    createHistoricoPesquisa,
    findUltimasPesquisasByUsuarioId,
    findHistoricoPesquisaById,
    deleteHistoricoPesquisaById
};
