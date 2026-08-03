const express = require("express");

const router = express.Router();

const authController = require("../controllers/auth.controller");
const authValidator = require("../validators/auth.validator");

// Faz o login de usuário
router.post("/login", authValidator.login, authController.login);
// Envia um código de recuperação para o email do usuário
router.post("/esqueci-senha", authValidator.esqueciSenha, authController.esqueciSenha);
// Redefine a senha do usuário usando o código de recuperação enviado por email
router.post("/redefinir-senha", authValidator.redefinirSenha, authController.redefinirSenha);

module.exports = router;