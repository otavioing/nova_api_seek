const postRepository = require(
    "../repositories/post.repository"
);

const AppError = require(
    "../utils/AppError"
);

const categoriaPostService = require(
    "./categoriaPost.service"
);

const create = async (
    usuarioId,
    titulo,
    descricao,
    visibilidade,
    conteudo18,
    colaboradores,
    permissaoComentarios,
    capa,
    categorias,
    imagens
) => {

    const status =
        String(visibilidade).toLowerCase() === "privado"
            ? "OCULTO"
            : "ATIVO";

    const conteudoMais18 =
        [true, "true", 1, "1"].includes(conteudo18) ? 1 : 0;

    const colaboradoresIds =
        Array.isArray(colaboradores)
            ? colaboradores.map(id => Number(id))
            : [];

    const permissaoComentariosMap = {
        ninguem: "NINGUEM",
        seguidores: "SEGUIDORES",
        todos: "TODOS"
    };

    const permissaoParaComentar =
        permissaoComentariosMap[
            String(permissaoComentarios).toLowerCase()
        ];

    const postId =
        await postRepository.create(
            usuarioId,
            titulo,
            descricao,
            capa,
            status,
            conteudoMais18,
            colaboradoresIds,
            permissaoParaComentar
        );

    const categoriaIds =
        await categoriaPostService
            .obterOuCriarCategorias(
                categorias
            );

    if (categoriaIds.length > 0) {

        await postRepository.addCategorias(
            postId,
            categoriaIds
        );
    }

    if (imagens.length > 0) {

        await postRepository.addImagens(
            postId,
            imagens
        );
    }

    return postId;
};

const getById = async (
    postId,
    usuarioId
) => {

    const post =
        await postRepository.findById(
            postId
        );

    if (!post) {
        return null;
    }

    const imagens =
        await postRepository.getImagens(
            postId
        );

    const comentarios =
        await postRepository.getComentarios(
            postId
        );

    const usuarioCurtiu =
        await postRepository.usuarioCurtiu(
            postId,
            usuarioId
        );

    const usuarioSalvou =
        await postRepository.usuarioSalvou(
            postId,
            usuarioId
        );

    return {
        ...post,
        imagens,
        comentarios,
        usuario_curtiu: usuarioCurtiu,
        usuario_salvou: usuarioSalvou
    };
};

const carregarDadosExtrasPosts = async (posts) => {
    for (const post of posts) {

        post.imagens =
            await postRepository.getImagens(
                post.id
            );

        post.colaboradores =
            await postRepository.findColaboradoresByPostId(
                post.id
            );
    }

    return posts;
};

const getAll = async () => {

    const posts =
        await postRepository.findAll();

    return carregarDadosExtrasPosts(posts);
};

const like = async (
    postId,
    usuarioId
) => {

    const post =
        await postRepository.findById(
            postId
        );

    if (!post) {
        return false;
    }

    await postRepository.addLike(
        postId,
        usuarioId
    );

    return true;
};

const removeLike = async (
    postId,
    usuarioId
) => {

    const post =
        await postRepository.findById(
            postId
        );

    if (!post) {
        return false;
    }

    await postRepository.removeLike(
        postId,
        usuarioId
    );

    return true;
};

const getCurtidos = async (
    usuarioId
) => {

    const posts =
        await postRepository.findCurtidosByUsuario(
            usuarioId
        );

    return posts;
};

const save = async (
    postId,
    usuarioId
) => {

    const post =
        await postRepository.findById(
            postId
        );

    if (!post) {
        return false;
    }

    await postRepository.addSave(
        postId,
        usuarioId
    );

    return true;
};

const removeSave = async (
    postId,
    usuarioId
) => {

    const post =
        await postRepository.findById(
            postId
        );

    if (!post) {
        return false;
    }

    await postRepository.removeSave(
        postId,
        usuarioId
    );

    return true;
};

const getSalvos = async (
    usuarioId
) => {

    const posts =
        await postRepository.findSalvosByUsuario(
            usuarioId
        );

    return posts;
};

const comment = async (
    postId,
    usuarioId,
    comentario
) => {

    const post =
        await postRepository.findById(
            postId
        );

    if (!post) {
        return null;
    }

    return postRepository.addComentario(
        postId,
        usuarioId,
        comentario
    );
};

const replyComment = async (
    comentarioId,
    usuarioId,
    resposta
) => {

    const comentario =
        await postRepository.findComentarioById(
            comentarioId
        );

    if (!comentario) {
        return null;
    }

    return postRepository.addRespostaComentario(
        comentarioId,
        usuarioId,
        resposta
    );
};

const getCommentReplies = async (
    comentarioId
) => {

    const comentario =
        await postRepository.findComentarioById(
            comentarioId
        );

    if (!comentario) {
        return null;
    }

    return postRepository.getRespostasComentario(
        comentarioId
    );
};

const findByCategoria = async (idCategoria) => {
    const posts = await postRepository.findByCategoria(idCategoria);
    
    if (!posts || posts.length === 0) {
        throw new AppError("Nenhum post encontrado para esta categoria.", 404);
    }

    return carregarDadosExtrasPosts(posts);
};

const findByUsuarioId = async (usuarioId) => {
    const posts = await postRepository.findByUsuarioId(usuarioId);

    return carregarDadosExtrasPosts(posts);
};

const removePost = async (
    postId,
    usuarioId
) => {

    const post =
        await postRepository.findDonoEStatusById(
            postId
        );

    if (!post || post.status !== "ATIVO") {
        throw new AppError(
            "Post não encontrado.",
            404
        );
    }

    if (post.usuario_id !== usuarioId) {
        throw new AppError(
            "Você não tem permissão para excluir este post.",
            403
        );
    }

    await postRepository.marcarComoExcluido(
        postId
    );
};

module.exports = {
    create,
    getById,
    getAll,
    like,
    removeLike,
    getCurtidos,
    save,
    removeSave,
    getSalvos,
    comment,
    replyComment,
    getCommentReplies,
    findByCategoria,
    findByUsuarioId,
    removePost
};
