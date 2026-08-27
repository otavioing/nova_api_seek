const banco = require("../config/database");

const findByNome = async (nome) => {

    const [rows] = await banco.query(
        `
        SELECT id
        FROM categorias_vagas
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
        INSERT INTO categorias_vagas (nome)
        VALUES (?)
        `,
        [nome]
    );

    return result.insertId;
};

const findById = async id => {

    const [rows] = await banco.query(
        `
        SELECT id
        FROM categorias_vagas
        WHERE id = ?
        LIMIT 1
        `,
        [id]
    );

    return rows[0] || null;
};

module.exports = {
    findByNome,
    create,
    findById
};
