const express = require("express");
const notificacoesController = require("../controllers/notificacoes.controller");
const notificacoesValidator = require("../validators/notificacoes.validator");
const auth = require("../middlewares/auth.middleware");

const router = express.Router();

router.use(auth);

// Lista todas as notificações do usuário logado
router.get("/", notificacoesController.listar);
// Limpa todas as notificações do usuário logado
router.delete("/", notificacoesController.limparTudo);
// Marca uma notificação como lida
router.patch("/:id/lida", notificacoesValidator.validarIdParam, notificacoesController.marcarLida);
// Exclui uma notificação específica
router.delete("/:id", notificacoesValidator.validarIdParam, notificacoesController.excluir);

module.exports = router;