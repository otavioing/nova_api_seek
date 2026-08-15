const banco = require("../config/database");

const findAll = async () => {

    const [rows] = await banco.query(
        `
        SELECT
            p.id,
            p.titulo,
            p.descricao,
            p.capa,
            p.data_criacao,

            u.id AS usuario_id,
            u.nome,
            u.foto_perfil,

            (
                SELECT COUNT(*)
                FROM likes_posts lp
                WHERE lp.id_post = p.id
            ) AS likes,

            (
                SELECT COUNT(*)
                FROM posts_salvos ps
                WHERE ps.id_post = p.id
            ) AS salvos

        FROM posts p

        INNER JOIN usuarios u
            ON u.id = p.id_usuario

        WHERE p.status = 'ATIVO'

        ORDER BY p.data_criacao DESC
        `
    );

    return rows;
};

const findById = async (postId) => {

    const [rows] = await banco.query(
        `
        SELECT
            p.id,
            p.titulo,
            p.descricao,
            p.capa,

            u.id AS usuario_id,
            u.nome,
            u.foto_perfil,

            (
                SELECT COUNT(*)
                FROM likes_posts lp
                WHERE lp.id_post = p.id
            ) AS likes,

            (
                SELECT COUNT(*)
                FROM posts_salvos ps
                WHERE ps.id_post = p.id
            ) AS salvos

        FROM posts p

        INNER JOIN usuarios u
            ON u.id = p.id_usuario

        WHERE p.id = ?
        `,
        [postId]
    );

    return rows[0] || null;
};

const create = async (
    usuarioId,
    titulo,
    descricao,
    capa
) => {

    const [result] = await banco.query(
        `
        INSERT INTO posts
        (
            id_usuario,
            titulo,
            descricao,
            capa
        )
        VALUES
        (
            ?,
            ?,
            ?,
            ?
        )
        `,
        [
            usuarioId,
            titulo,
            descricao,
            capa
        ]
    );

    return result.insertId;
};

const addCategorias = async (
    postId,
    categorias
) => {

    const valores = categorias.map(
        categoriaId => [
            postId,
            categoriaId
        ]
    );

    await banco.query(
        `
        INSERT INTO posts_categorias_rel
        (
            id_post,
            id_categoria
        )
        VALUES ?
        `,
        [valores]
    );
};

const addImagens = async (
    postId,
    imagens
) => {

    const valores = imagens.map(
        imagem => [
            postId,
            imagem
        ]
    );

    await banco.query(
        `
        INSERT INTO posts_imagens
        (
            id_post,
            caminho_imagem
        )
        VALUES ?
        `,
        [valores]
    );
};

const getImagens = async (postId) => {

    const [rows] = await banco.query(
        `
        SELECT caminho_imagem
        FROM posts_imagens
        WHERE id_post = ?
        `,
        [postId]
    );

    return rows;
};

const getComentarios = async (postId) => {

    const [rows] = await banco.query(
        `
        SELECT
            c.id,
            c.comentario,
            c.data_comentario,

            (
                SELECT COUNT(*)
                FROM respostas_comentarios rc
                WHERE rc.id_comentario = c.id
            ) AS quantidade_respostas,

            u.id AS usuario_id,
            u.nome,
            u.foto_perfil

        FROM comentarios c

        INNER JOIN usuarios u
            ON u.id = c.id_usuario

        WHERE c.id_post = ?

        ORDER BY c.data_comentario DESC
        `,
        [postId]
    );

    return rows;
};

const findComentarioById = async (
    comentarioId
) => {

    const [rows] = await banco.query(
        `
        SELECT id
        FROM comentarios
        WHERE id = ?
        LIMIT 1
        `,
        [comentarioId]
    );

    return rows[0] || null;
};

const addComentario = async (
    postId,
    usuarioId,
    comentario
) => {

    const [result] = await banco.query(
        `
        INSERT INTO comentarios
        (
            id_usuario,
            id_post,
            comentario
        )
        VALUES
        (
            ?,
            ?,
            ?
        )
        `,
        [
            usuarioId,
            postId,
            comentario
        ]
    );

    return result.insertId;
};

const addRespostaComentario = async (
    comentarioId,
    usuarioId,
    resposta
) => {

    const [result] = await banco.query(
        `
        INSERT INTO respostas_comentarios
        (
            id_comentario,
            id_usuario,
            resposta
        )
        VALUES
        (
            ?,
            ?,
            ?
        )
        `,
        [
            comentarioId,
            usuarioId,
            resposta
        ]
    );

    return result.insertId;
};

const getRespostasComentario = async (
    comentarioId
) => {

    const [rows] = await banco.query(
        `
        SELECT
            rc.id,
            rc.resposta,
            rc.data_resposta,

            u.id AS usuario_id,
            u.nome,
            u.foto_perfil

        FROM respostas_comentarios rc

        INNER JOIN usuarios u
            ON u.id = rc.id_usuario

        WHERE rc.id_comentario = ?

        ORDER BY rc.data_resposta ASC
        `,
        [comentarioId]
    );

    return rows;
};

const usuarioCurtiu = async (
    postId,
    usuarioId
) => {

    const [rows] = await banco.query(
        `
        SELECT id
        FROM likes_posts
        WHERE id_post = ?
        AND id_usuario = ?
        LIMIT 1
        `,
        [
            postId,
            usuarioId
        ]
    );

    return rows.length > 0;
};

const usuarioSalvou = async (
    postId,
    usuarioId
) => {

    const [rows] = await banco.query(
        `
        SELECT id
        FROM posts_salvos
        WHERE id_post = ?
        AND id_usuario = ?
        LIMIT 1
        `,
        [
            postId,
            usuarioId
        ]
    );

    return rows.length > 0;
};

const addLike = async (
    postId,
    usuarioId
) => {

    await banco.query(
        `
        INSERT IGNORE INTO likes_posts
        (
            id_usuario,
            id_post
        )
        VALUES
        (
            ?,
            ?
        )
        `,
        [
            usuarioId,
            postId
        ]
    );
};

const removeLike = async (
    postId,
    usuarioId
) => {

    await banco.query(
        `
        DELETE FROM likes_posts
        WHERE id_post = ?
        AND id_usuario = ?
        `,
        [
            postId,
            usuarioId
        ]
    );
};

const findCurtidosByUsuario = async (usuarioId) => {
    const [rows] = await banco.query(
        `
        SELECT p.*, lp.data_curtida
        FROM posts p
        INNER JOIN likes_posts lp ON p.id = lp.id_post
        WHERE lp.id_usuario = ? AND p.status = 'ATIVO'
        ORDER BY lp.data_curtida DESC
        `,
        [usuarioId]
    );
    
    return rows;
};

const addSave = async (
    postId,
    usuarioId
) => {

    await banco.query(
        `
        INSERT IGNORE INTO posts_salvos
        (
            id_usuario,
            id_post
        )
        VALUES
        (
            ?,
            ?
        )
        `,
        [
            usuarioId,
            postId
        ]
    );
};

const removeSave = async (
    postId,
    usuarioId
) => {

    await banco.query(
        `
        DELETE FROM posts_salvos
        WHERE id_post = ?
        AND id_usuario = ?
        `,
        [
            postId,
            usuarioId
        ]
    );
};

const findSalvosByUsuario = async (usuarioId) => {
    const [rows] = await banco.query(
        `
        SELECT p.*, ps.data_salvo
        FROM posts p
        INNER JOIN posts_salvos ps ON p.id = ps.id_post
        WHERE ps.id_usuario = ? AND p.status = 'ATIVO'
        ORDER BY ps.data_salvo DESC
        `,
        [usuarioId]
    );
    
    return rows;
};



module.exports = {
    findAll,
    findById,
    create,
    addCategorias,
    addImagens,
    getImagens,
    getComentarios,
    findComentarioById,
    addComentario,
    addRespostaComentario,
    getRespostasComentario,
    usuarioCurtiu,
    usuarioSalvou,
    addLike,
    removeLike,
    findCurtidosByUsuario,
    addSave,
    removeSave,
    findSalvosByUsuario,
};
