const categoriaService = require("../services/categoriaPost.service");
const response = require("../utils/response");

const listarPopulares = async (
    req,
    res,
    next
) => {

    try {

        const categorias = await categoriaService.getCategoriasPopulares();

        return response.success(
            res,
            "Categorias encontradas com sucesso.",
            categorias,
            categorias.length
        );

    } catch (error) {
        next(error);
    }

};

module.exports = {
    listarPopulares
};