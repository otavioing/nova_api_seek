const response = require(
    "../utils/response"
);

const postService = require(
    "../services/post.service"
);

const {
    montarUrlArquivo
} = require("../utils/fileUrl");

const create = async (
    req,
    res,
    next
) => {

    try {

        const {
            titulo,
            descricao
        } = req.body;

        let categorias = req.body.categorias;

        if (
            typeof categorias ===
            "string"
        ) {
            categorias =
                JSON.parse(categorias);
        }

        const capa =
            req.files?.capa?.[0]
                ? `/uploads/posts/${req.files.capa[0].filename}`
                : null;

        const imagens =
            req.files?.imagens?.map(
                arquivo =>
                    `/uploads/posts/${arquivo.filename}`
            ) || [];

        const postId =
            await postService.create(
                req.user.id,
                titulo,
                descricao,
                capa,
                categorias,
                imagens
            );

        return response.success(
            res,
            "Post criado com sucesso.",
            {
                id: postId
            },
            null,
            201
        );

    } catch (error) {
        next(error);
    }
};


const getById = async (
    req,
    res,
    next
) => {

    try {

        const { id } = req.params;

        const post =
            await postService.getById(id, req.user.id);

        if (!post) {

            return response.error(
                res,
                "Post não encontrado.",
                404
            );
        }

        post.foto_perfil =
            montarUrlArquivo(
                req,
                post.foto_perfil
            );

        post.capa =
            montarUrlArquivo(
                req,
                post.capa
            );

        post.imagens =
            post.imagens.map(
                imagem =>
                    montarUrlArquivo(
                        req,
                        imagem.caminho_imagem
                    )
            );

        post.comentarios =
            post.comentarios.map(
                comentario => ({
                    id: comentario.id,
                    comentario:
                        comentario.comentario,
                    data_comentario:
                        comentario.data_comentario,
                    quantidade_respostas:
                        comentario.quantidade_respostas,
                    usuario: {
                        id:
                            comentario.usuario_id,
                        nome:
                            comentario.nome,
                        foto_perfil:
                            montarUrlArquivo(
                                req,
                                comentario.foto_perfil
                            )
                    }
                })
            );

        return response.success(
            res,
            "Post encontrado com sucesso.",
            post
        );

    } catch (error) {
        next(error);
    }
};

const like = async (
    req,
    res,
    next
) => {

    try {

        const { id } = req.params;

        const postExiste =
            await postService.like(
                id,
                req.user.id
            );

        if (!postExiste) {

            return response.error(
                res,
                "Post nao encontrado.",
                404
            );
        }

        return response.success(
            res,
            "Post curtido com sucesso."
        );

    } catch (error) {
        next(error);
    }
};

const removeLike = async (
    req,
    res,
    next
) => {

    try {

        const { id } = req.params;

        const postExiste =
            await postService.removeLike(
                id,
                req.user.id
            );

        if (!postExiste) {

            return response.error(
                res,
                "Post nÃ£o encontrado.",
                404
            );
        }

        return response.success(
            res,
            "Curtida removida com sucesso."
        );

    } catch (error) {
        next(error);
    }
};

const getCurtidos = async (req, res, next) => {
    try {
        const posts = await postService.getCurtidos(req.user.id);

        return response.success(
            res,
            "Posts curtidos encontrados.",
            posts,
            posts.length
        );

    } catch (error) {
        next(error);
    }
};

const save = async (
    req,
    res,
    next
) => {

    try {

        const { id } = req.params;

        const postExiste =
            await postService.save(
                id,
                req.user.id
            );

        if (!postExiste) {

            return response.error(
                res,
                "Post nÃ£o encontrado.",
                404
            );
        }

        return response.success(
            res,
            "Post salvo com sucesso."
        );

    } catch (error) {
        next(error);
    }
};

const removeSave = async (
    req,
    res,
    next
) => {

    try {

        const { id } = req.params;

        const postExiste =
            await postService.removeSave(
                id,
                req.user.id
            );

        if (!postExiste) {

            return response.error(
                res,
                "Post nÃ£o encontrado.",
                404
            );
        }

        return response.success(
            res,
            "Post removido dos salvos com sucesso."
        );

    } catch (error) {
        next(error);
    }
};

const getSalvos = async (req, res, next) => {
    try {
        const posts = await postService.getSalvos(req.user.id);

        return response.success(
            res,
            "Posts salvos encontrados.",
            posts,
            posts.length
        );

    } catch (error) {
        next(error);
    }
};

const comment = async (
    req,
    res,
    next
) => {

    try {

        const { id } = req.params;
        const { comentario } = req.body;

        const comentarioId =
            await postService.comment(
                id,
                req.user.id,
                comentario
            );

        if (!comentarioId) {

            return response.error(
                res,
                "Post nao encontrado.",
                404
            );
        }

        return response.success(
            res,
            "Comentario criado com sucesso.",
            {
                id: comentarioId
            },
            null,
            201
        );

    } catch (error) {
        next(error);
    }
};

const replyComment = async (
    req,
    res,
    next
) => {

    try {

        const { id } = req.params;
        const { resposta } = req.body;

        const respostaId =
            await postService.replyComment(
                id,
                req.user.id,
                resposta
            );

        if (!respostaId) {

            return response.error(
                res,
                "Comentario nao encontrado.",
                404
            );
        }

        return response.success(
            res,
            "Resposta criada com sucesso.",
            {
                id: respostaId
            },
            null,
            201
        );

    } catch (error) {
        next(error);
    }
};

const getCommentReplies = async (
    req,
    res,
    next
) => {

    try {

        const { id } = req.params;

        const respostas =
            await postService.getCommentReplies(
                id
            );

        if (!respostas) {

            return response.error(
                res,
                "Comentario nao encontrado.",
                404
            );
        }

        const respostasFormatadas =
            respostas.map(
                resposta => ({
                    id: resposta.id,
                    resposta:
                        resposta.resposta,
                    data_resposta:
                        resposta.data_resposta,
                    usuario: {
                        id:
                            resposta.usuario_id,
                        nome:
                            resposta.nome,
                        foto_perfil:
                            montarUrlArquivo(
                                req,
                                resposta.foto_perfil
                            )
                    }
                })
            );

        return response.success(
            res,
            "Respostas encontradas com sucesso.",
            respostasFormatadas,
            respostasFormatadas.length
        );

    } catch (error) {
        next(error);
    }
};

module.exports = {
    create,
    getById,
    like,
    removeLike,
    getCurtidos,
    save,
    removeSave,
    getSalvos,
    comment,
    replyComment,
    getCommentReplies
};
