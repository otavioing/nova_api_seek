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

const getAll = async (
    req,
    res,
    next
) => {

    try {

        const posts =
            await postService.getAll();

        const agora = new Date();

        const postsFormatados =
            posts.map(post => {

                const dataPostagem =
                    new Date(
                        post.data_criacao
                    );

                const diferenca =
                    agora - dataPostagem;

                const segundos =
                    Math.floor(
                        diferenca / 1000
                    );

                const minutos =
                    Math.floor(
                        segundos / 60
                    );

                const horas =
                    Math.floor(
                        minutos / 60
                    );

                const dias =
                    Math.floor(
                        horas / 24
                    );

                let tempoAtras;

                if (segundos < 60) {

                    tempoAtras =
                        "Agora";

                } else if (minutos < 60) {

                    tempoAtras =
                        `${minutos} ${
                            minutos === 1
                                ? "minuto"
                                : "minutos"
                        } atrás`;

                } else if (horas < 24) {

                    tempoAtras =
                        `${horas} ${
                            horas === 1
                                ? "hora"
                                : "horas"
                        } atrás`;

                } else if (dias < 30) {

                    tempoAtras =
                        `${dias} ${
                            dias === 1
                                ? "dia"
                                : "dias"
                        } atrás`;

                } else {

                    tempoAtras =
                        dataPostagem.toLocaleDateString(
                            "pt-BR"
                        );
                }

                return {

                    id: post.id,

                    titulo:
                        post.titulo,

                    descricao:
                        post.descricao,

                    capa:
                        montarUrlArquivo(
                            req,
                            post.capa
                        ),

                    imagens:
                        post.imagens.map(
                            imagem =>
                                montarUrlArquivo(
                                    req,
                                    imagem.caminho_imagem
                                )
                        ),

                    criador: {
                        id:
                            post.usuario_id,

                        nome:
                            post.nome,

                        foto_perfil:
                            montarUrlArquivo(
                                req,
                                post.foto_perfil
                            )
                    },

                    data_postagem:
                        post.data_criacao,

                    tempo_atras:
                        tempoAtras,

                    likes:
                        post.likes,

                    salvos:
                        post.salvos
                };
            });

        return response.success(
            res,
            "Posts encontrados com sucesso.",
            postsFormatados,
            postsFormatados.length
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
    getAll,
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
