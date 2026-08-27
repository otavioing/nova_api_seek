const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/auth.middleware");
const vagaController = require("../controllers/vaga.controller");
const vagaValidator = require("../validators/vaga.validator");

// Cria uma nova vaga 
router.post("/", authMiddleware, vagaValidator.criar, vagaController.criar);
// Lista as vagas do banco
router.get("/", authMiddleware, vagaController.listar);
// Filtra vagas por categoria (ID ou nome)
router.get("/categoria/:categoria", authMiddleware, vagaValidator.categoria, vagaController.listarPorCategoria);
// Filtra vagas pelo intervalo inclusivo de datas de criação
router.get("/data", authMiddleware, vagaValidator.data, vagaController.listarPorData);
// Lista as categorias mais utilizadas nas vagas abertas
router.get("/mais-utilizados", authMiddleware, vagaValidator.maisUtilizados, vagaController.listarFiltrosMaisUtilizados);
// lista as vagas favoritas do usuario
router.get("/favoritas", authMiddleware, vagaController.listarFavoritas);
// Lista todas as vagas de um usuário específico
router.get("/usuario/:id", authMiddleware, vagaValidator.validarId, vagaController.listarPorUsuario);
// Favorita uma vaga para o usuário autenticado
router.post("/:id/favoritar", authMiddleware, vagaValidator.validarId, vagaController.favoritar);
// Obtém os detalhes de uma vaga específica
router.get("/:id", authMiddleware, vagaValidator.validarId, vagaController.obter);
// Remove uma vaga dos favoritos do usuário autenticado
router.delete("/:id/favoritar", authMiddleware, vagaValidator.validarId, vagaController.desfavoritar);

module.exports = router;
