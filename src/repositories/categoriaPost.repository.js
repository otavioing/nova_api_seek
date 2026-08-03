const banco = require("../config/database");

const findByNome = async (nome) => {

    const [rows] = await banco.query(
        `
        SELECT id
        FROM categorias_posts
        WHERE LOWER(nome) = LOWER(?)
        LIMIT 1
        `,
        [nome]
    );

    return rows[0] || null;
};

const create = async (nome) => {

    const [result] = await banco.query(
        `
        INSERT INTO categorias_posts
        (
            nome
        )
        VALUES
        (
            ?
        )
        `,
        [nome]
    );

    return result.insertId;
};

module.exports = {
    findByNome,
    create
};