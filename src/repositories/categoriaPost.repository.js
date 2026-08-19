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

const findMaisUsadas = async () => {
    const [rows] = await banco.query(
        `
        SELECT 
            cp.id, 
            cp.nome, 
            COUNT(pcr.id_post) AS total_usos
        FROM categorias_posts cp
        LEFT JOIN posts_categorias_rel pcr ON cp.id = pcr.id_categoria
        GROUP BY cp.id, cp.nome
        ORDER BY total_usos DESC
        `
    );

    return rows;
};

module.exports = {
    findByNome,
    create,
    findMaisUsadas
};