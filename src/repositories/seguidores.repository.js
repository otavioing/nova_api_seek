const db = require("../config/database");

const buscarUsuarioPorId = async (id) => {

    const [rows] = await db.query(
        `
        SELECT id
        FROM usuarios
        WHERE id = ?
        `,
        [id]
    );

    return rows[0] || null;
};

const jaSegue = async (idSeguidor, idSeguido) => {

    const [rows] = await db.query(
        `
        SELECT id
        FROM seguidores
        WHERE id_seguidor = ?
        AND id_seguido = ?
        `,
        [idSeguidor, idSeguido]
    );

    return rows[0] || null;
};

const seguir = async (idSeguidor, idSeguido) => {

    const [result] = await db.query(
        `
        INSERT INTO seguidores
        (
            id_seguidor,
            id_seguido
        )
        VALUES
        (?, ?)
        `,
        [idSeguidor, idSeguido]
    );

    return result.insertId;
};

const deixarDeSeguir = async (idSeguidor, idSeguido) => {

    const [result] = await db.query(
        `
        DELETE FROM seguidores
        WHERE id_seguidor = ?
        AND id_seguido = ?
        `,
        [idSeguidor, idSeguido]
    );

    return result.affectedRows;
};

const listarSeguidores = async (idUsuario) => {

    const [rows] = await db.query(
        `
        SELECT
            u.id,
            u.nome,
            u.tipo_usuario,
            u.foto_perfil
        FROM seguidores s
        INNER JOIN usuarios u
            ON u.id = s.id_seguidor
        WHERE s.id_seguido = ?
        ORDER BY u.nome
        `,
        [idUsuario]
    );

    return rows;
};

const listarSeguindo = async (idUsuario) => {

    const [rows] = await db.query(
        `
        SELECT
            u.id,
            u.nome,
            u.tipo_usuario,
            u.foto_perfil
        FROM seguidores s
        INNER JOIN usuarios u
            ON u.id = s.id_seguido
        WHERE s.id_seguidor = ?
        ORDER BY u.nome
        `,
        [idUsuario]
    );

    return rows;
};

module.exports = {
    buscarUsuarioPorId,
    jaSegue,
    seguir,
    deixarDeSeguir,
    listarSeguidores,
    listarSeguindo
};