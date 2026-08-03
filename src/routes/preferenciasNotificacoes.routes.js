const express = require("express");
const router = express.Router();

const authMiddleware = require("../middlewares/auth.middleware");
const preferenciasController = require("../controllers/preferenciasNotificacoes.controller");
const preferenciasValidator = require("../validators/preferenciasNotificacoes.validator");

router.use(authMiddleware);

// Obtém as preferências de notificações do usuário logado
router.get("/",preferenciasController.get);
// Atualiza as preferências de notificações do usuário logado
router.put("/",preferenciasValidator.update,preferenciasController.update);

module.exports = router;