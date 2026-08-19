const express = require("express");

const router = express.Router();

const authController = require("../controllers/auth.controller");
const authValidator = require("../validators/auth.validator");
const authMiddleware = require("../middlewares/auth.middleware");


// Faz o login de usuário
router.post("/login", authValidator.login, authController.login);
// Faz o logout de usuário
router.post("/logout", authValidator.logout, authController.logout);
// Retorna informações do usuário autenticado
router.get("/me", authValidator.me, authMiddleware, authController.me);
// Retorna o ID do usuário autenticado
router.get("/id", authMiddleware, authController.idUsuario);
// Envia um código de recuperação para o email do usuário
router.post("/esqueci-senha", authValidator.esqueciSenha, authController.esqueciSenha);
// Redefine a senha do usuário usando o código de recuperação enviado por email
router.post("/redefinir-senha", authValidator.redefinirSenha, authController.redefinirSenha);


module.exports = router;