const banco = require("../config/database");

const create = async (
    empresaId,
    titulo,
    descricao,
    linkLinkedin
) => {

    const [result] = await banco.query(
        `
        INSERT INTO vagas
        (
            id_empresa,
            titulo,
            descricao,
            link_linkedin
        )
        VALUES (?, ?, ?, ?)
        `,
        [empresaId, titulo, descricao, linkLinkedin]
    );

    return result.insertId;
};

const addCategorias = async (vagaId, categoriaIds) => {

    const valores = categoriaIds.map(
        categoriaId => [vagaId, categoriaId]
    );

    await banco.query(
        `
        INSERT INTO vagas_categorias_rel
        (
            id_vaga,
            id_categoria
        )
        VALUES ?
        `,
        [valores]
    );
};

const findCategoriasByVagaId = async vagaId => {

    const [rows] = await banco.query(
        `
        SELECT
            cv.id,
            cv.nome
        FROM vagas_categorias_rel vcr
        INNER JOIN categorias_vagas cv
            ON cv.id = vcr.id_categoria
        WHERE vcr.id_vaga = ?
        ORDER BY cv.nome ASC
        `,
        [vagaId]
    );

    return rows;
};

const incluirCategorias = async vagas => {

    return await Promise.all(
        vagas.map(async vaga => ({
            ...vaga,
            categorias: await findCategoriasByVagaId(vaga.id)
        }))
    );
};

const findById = async (vagaId) => {

    const [rows] = await banco.query(
        `
        SELECT
            v.id,
            v.id_empresa,
            v.titulo,
            v.descricao,
            v.link_linkedin,
            v.data_criacao,
            v.data_atualizacao,
            v.status,
            u.nome AS empresa_nome
        FROM vagas v
        INNER JOIN usuarios u ON u.id = v.id_empresa
        WHERE v.id = ?
        LIMIT 1
        `,
        [vagaId]
    );

    if (rows.length === 0) {
        return null;
    }

    return (await incluirCategorias(rows))[0];
};

const findAll = async () => {

    const [rows] = await banco.query(
        `
        SELECT
            v.id,
            v.id_empresa,
            v.titulo,
            v.descricao,
            v.link_linkedin,
            v.data_criacao,
            v.data_atualizacao,
            v.status,
            u.nome AS empresa_nome
        FROM vagas v
        INNER JOIN usuarios u ON u.id = v.id_empresa
        WHERE v.status = 'ABERTA'
        ORDER BY v.data_criacao DESC
        `
    );

    return incluirCategorias(rows);
};

const findByCategoria = async categoria => {

    const [rows] = await banco.query(
        `
        SELECT DISTINCT
            v.id,
            v.id_empresa,
            v.titulo,
            v.descricao,
            v.link_linkedin,
            v.data_criacao,
            v.data_atualizacao,
            v.status,
            u.nome AS empresa_nome
        FROM vagas v
        INNER JOIN usuarios u ON u.id = v.id_empresa
        INNER JOIN vagas_categorias_rel vcr ON vcr.id_vaga = v.id
        INNER JOIN categorias_vagas cv ON cv.id = vcr.id_categoria
        WHERE v.status = 'ABERTA'
            AND (cv.id = ? OR LOWER(cv.nome) = LOWER(?))
        ORDER BY v.data_criacao DESC
        `,
        [categoria, categoria]
    );

    return incluirCategorias(rows);
};

const findByData = async (dataInicio, dataFim) => {

    const [rows] = await banco.query(
        `
        SELECT
            v.id,
            v.id_empresa,
            v.titulo,
            v.descricao,
            v.link_linkedin,
            v.data_criacao,
            v.data_atualizacao,
            v.status,
            u.nome AS empresa_nome
        FROM vagas v
        INNER JOIN usuarios u ON u.id = v.id_empresa
        WHERE v.status = 'ABERTA'
            AND v.data_criacao >= ?
            AND v.data_criacao < DATE_ADD(?, INTERVAL 1 DAY)
        ORDER BY v.data_criacao DESC
        `,
        [dataInicio, dataFim]
    );

    return incluirCategorias(rows);
};

const findCategoriasMaisUtilizadas = async limite => {

    const [rows] = await banco.query(
        `
        SELECT
            cv.id,
            cv.nome,
            COUNT(DISTINCT v.id) AS quantidade_vagas
        FROM categorias_vagas cv
        INNER JOIN vagas_categorias_rel vcr ON vcr.id_categoria = cv.id
        INNER JOIN vagas v ON v.id = vcr.id_vaga
        WHERE v.status = 'ABERTA'
        GROUP BY cv.id, cv.nome
        ORDER BY quantidade_vagas DESC, cv.nome ASC
        LIMIT ${limite}
        `
    );

    return rows;
};

const findByUsuarioId = async usuarioId => {

    const [rows] = await banco.query(
        `
        SELECT
            v.id,
            v.id_empresa,
            v.titulo,
            v.descricao,
            v.link_linkedin,
            v.data_criacao,
            v.data_atualizacao,
            v.status,
            u.nome AS empresa_nome
        FROM vagas v
        INNER JOIN usuarios u ON u.id = v.id_empresa
        WHERE v.id_empresa = ?
        ORDER BY v.data_criacao DESC
        `,
        [usuarioId]
    );

    return incluirCategorias(rows);
};

const findFavoritasByUsuario = async (usuarioId) => {

    const [rows] = await banco.query(
        `
        SELECT
            v.id,
            v.id_empresa,
            v.titulo,
            v.descricao,
            v.link_linkedin,
            v.data_criacao,
            v.data_atualizacao,
            v.status,
            u.nome AS empresa_nome,
            vf.data_favorito
        FROM vagas_favoritas vf
        INNER JOIN vagas v ON v.id = vf.id_vaga
        INNER JOIN usuarios u ON u.id = v.id_empresa
        WHERE vf.id_usuario = ?
        ORDER BY vf.data_favorito DESC
        `,
        [usuarioId]
    );

    return incluirCategorias(rows);
};

const findFavorita = async (usuarioId, vagaId) => {

    const [rows] = await banco.query(
        `
        SELECT id
        FROM vagas_favoritas
        WHERE id_usuario = ? AND id_vaga = ?
        LIMIT 1
        `,
        [usuarioId, vagaId]
    );

    return rows[0] || null;
};

const addFavorita = async (usuarioId, vagaId) => {

    await banco.query(
        `
        INSERT INTO vagas_favoritas
        (id_usuario, id_vaga)
        VALUES (?, ?)
        `,
        [usuarioId, vagaId]
    );
};

const removeFavorita = async (usuarioId, vagaId) => {

    await banco.query(
        `
        DELETE FROM vagas_favoritas
        WHERE id_usuario = ? AND id_vaga = ?
        `,
        [usuarioId, vagaId]
    );
};

module.exports = {
    create,
    addCategorias,
    findById,
    findAll,
    findByCategoria,
    findByData,
    findCategoriasMaisUtilizadas,
    findByUsuarioId,
    findFavoritasByUsuario,
    findFavorita,
    addFavorita,
    removeFavorita
};
