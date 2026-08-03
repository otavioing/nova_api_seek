const express = require("express");

const router = express.Router();

const authMiddleware = require("../middlewares/auth.middleware");

const seguidoresController = require("../controllers/seguidores.controller");
const seguidoresValidator = require("../validators/seguidores.validator");

// Segue um usuário específico
router.post("/:id",authMiddleware,seguidoresValidator.validarIdUsuario,seguidoresController.seguir);
// Deixa de seguir um usuário específico
router.delete("/:id",authMiddleware,seguidoresValidator.validarIdUsuario,seguidoresController.deixarDeSeguir);
// Lista os seguidores de um usuário específico
router.get("/seguidores/:id",seguidoresValidator.validarIdUsuario,seguidoresController.listarSeguidores);
// Lista os usuários que um usuário específico está seguindo
router.get("/seguindo/:id",seguidoresValidator.validarIdUsuario,seguidoresController.listarSeguindo);
// Verifica o status de seguimento entre o usuário logado e outro usuário específico
router.get("/status/:id",authMiddleware,seguidoresValidator.validarIdUsuario,seguidoresController.verificarStatus);

module.exports = router;