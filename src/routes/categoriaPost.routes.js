const express = require("express");
const router = express.Router();
const categoriaController = require("../controllers/categoriaPost.controller");

// Rota GET que lista as categorias mais usadas
router.get("/populares", categoriaController.listarPopulares);

module.exports = router;