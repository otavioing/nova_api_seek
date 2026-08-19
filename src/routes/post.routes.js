const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/auth.middleware");
const uploadPost = require("../middlewares/uploadPost.middleware");
const postController = require("../controllers/post.controller");
const postValidator = require("../validators/post.validator");

// Cria um novo post
router.post("/", authMiddleware, uploadPost.fields([
    {
        name: "capa",
        maxCount: 1
    },
    {
        name: "imagens",
        maxCount: 10
    }
]), postValidator.validarCriacaoPost, postController.create);

// Adiciona um like a um post
router.post("/:id/like", authMiddleware, postController.like);
// Remove um like de um post
router.delete("/:id/like", authMiddleware, postController.removeLike);
// Lista os posts curtidos pelo usuario
router.get("/curtidos", authMiddleware, postController.getCurtidos);
// Salva um post
router.post("/:id/salvar", authMiddleware, postController.save);
// Remove um post salvo
router.delete("/:id/salvar", authMiddleware, postController.removeSave);
// Lista os posts salvos pelo usuario
router.get("/salvos", authMiddleware, postController.getSalvos);
// Cria um comentario em um post
router.post("/:id/comentarios", authMiddleware, postValidator.validarCriacaoComentario, postController.comment);
// Cria uma resposta a um comentario
router.post("/comentarios/:id/respostas", authMiddleware, postValidator.validarCriacaoResposta, postController.replyComment);
// Lista as respostas de um comentario
router.get("/comentarios/:id/respostas", authMiddleware, postController.getCommentReplies);
// Obtem todos os posts
router.get("/", authMiddleware, postController.getAll);
// Busca posts por categoria
router.get("/categoria/:id_categoria", postValidator.listarPorCategoria, postController.listarPorCategoria);
// Lista os posts de um usuario especifico
router.get("/usuario/:id_usuario", postValidator.listarPorUsuario, postController.listarPorUsuario);
// Exclui um post do usuario autenticado
router.delete("/:id", authMiddleware, postValidator.validarIdPost, postController.removePost);
// Obtem um post por ID
router.get("/:id", authMiddleware, postController.getById);

module.exports = router;