const montarUrlArquivo = (
    req,
    caminho
) => {

    if (!caminho) {
        return null;
    }

    return `${req.protocol}://${req.get("host")}${caminho}`;
};

module.exports = {
    montarUrlArquivo
};