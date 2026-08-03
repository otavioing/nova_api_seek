const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/auth.middleware");
const uploadPost = require("../middlewares/uploadPost.middleware");
const postController = require("../controllers/post.controller");
const {validarCriacaoPost,validarCriacaoComentario,validarCriacaoResposta} = require("../validators/post.validator");


//Cria um novo post
router.post("/",authMiddleware,uploadPost.fields([
    {
        name: "capa",
        maxCount: 1
    },
    {
        name: "imagens",
        maxCount: 10
    }
]),validarCriacaoPost,postController.create);

//Adiciona um like a um post
router.post("/:id/like",authMiddleware,postController.like);
//Remove um like de um post
router.delete("/:id/like",authMiddleware,postController.removeLike);
//Lista os posts curtidos pelo usuário
router.get("/curtidos", authMiddleware, postController.getCurtidos);
//Salva um post
router.post("/:id/salvar",authMiddleware,postController.save);
//Remove um post salvo
router.delete("/:id/salvar",authMiddleware,postController.removeSave);
//Lista os posts salvos pelo usuário
router.get("/salvos", authMiddleware, postController.getSalvos);
//Cria um comentário em um post
router.post("/:id/comentarios",authMiddleware,validarCriacaoComentario,postController.comment);
//Cria uma resposta a um comentário
router.post("/comentarios/:id/respostas",authMiddleware,validarCriacaoResposta,postController.replyComment);
//Lista as respostas de um comentário
router.get("/comentarios/:id/respostas",authMiddleware,postController.getCommentReplies);
//Obtém um post por ID
router.get("/:id",authMiddleware,postController.getById);

module.exports = router;
