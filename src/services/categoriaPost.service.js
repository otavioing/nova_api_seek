const categoriaRepository = require(
    "../repositories/categoriaPost.repository"
);

const obterOuCriarCategorias = async (
    categorias
) => {

    const ids = [];

    for (const nomeCategoria of categorias) {

        const nome = nomeCategoria.trim();

        let categoria =
            await categoriaRepository.findByNome(
                nome
            );

        if (!categoria) {

            const categoriaId =
                await categoriaRepository.create(
                    nome
                );

            ids.push(categoriaId);

        } else {

            ids.push(categoria.id);

        }
    }

    return ids;
};

const getCategoriasPopulares = async () => {
    
    const categorias = await categoriaRepository.findMaisUsadas();
    
    return categorias;
};

module.exports = {
    obterOuCriarCategorias,
    getCategoriasPopulares
};