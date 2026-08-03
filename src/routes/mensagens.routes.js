const express = require("express");
const router = express.Router();

const mensagemController = require("../controllers/mensagem.controller");
const mensagemValidator = require("../validators/mensagem.validator");
const authMiddleware = require("../middlewares/auth.middleware");
router.use(authMiddleware);

// Inicia uma nova conversa ou retorna uma existente
router.post("/conversas", mensagemValidator.iniciarConversa, mensagemController.iniciarConversa);
// Lista as conversas ativas do usuário logado
router.get("/conversas", mensagemController.listarConversas);
// Envia uma mensagem para uma conversa específica
router.post("/conversas/:id_conversa/mensagens", mensagemValidator.enviarMensagem, mensagemController.enviarMensagem);
// Lista o histórico de mensagens de uma conversa específica
router.get("/conversas/:id_conversa/mensagens", mensagemController.listarMensagens);

module.exports = router;