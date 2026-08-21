const express = require("express");
const router = express.Router();
const usuarioController = require("../controllers/usuario.controller");
const usuarioValidator = require("../validators/usuario.validator");
const {uploadPerfil,uploadBanner} = require("../middlewares/upload.middleware");
const authMiddleware = require("../middlewares/auth.middleware");


// Cria um novo usuário
router.post("/", usuarioValidator.create, usuarioController.create);
// Verifica se o código de verificação enviado por email é válido e ativa a conta do usuário
router.post("/verificar-codigo",usuarioValidator.verificar,usuarioController.verificarConta);
// Reenvia o código de verificação para o email do usuário
router.post("/reenviar-codigo",usuarioValidator.reenviarCodigo,usuarioController.reenviarCodigo);
// Verifica se o usuário logado é o primeiro login e se precisa completar o cadastro
router.get("/verificar-primeiro-login", authMiddleware, usuarioController.verificarPrimeiroLogin);
// Completa o cadastro do usuário logado
router.patch("/completar-cadastro", authMiddleware, usuarioController.completarCadastro);
// Retorna as últimas 5 pesquisas do usuário autenticado
router.get("/historico-pesquisas", authMiddleware, usuarioController.getUltimasPesquisas);
// Exclui uma pesquisa do histórico do usuário autenticado
router.delete("/historico-pesquisas/:id", authMiddleware, usuarioValidator.excluirHistoricoPesquisa, usuarioController.deleteHistoricoPesquisa);
// Pesquisa usuários por nome ou e-mail
router.get("/pesquisar", usuarioValidator.pesquisar, usuarioController.pesquisarUsuarios);
// Carrega a página pública de um usuário
router.get("/:id", usuarioController.getPaginaUsuario);
// Atualiza a foto de perfil do usuário logado
router.put("/:id/foto-perfil",authMiddleware,uploadPerfil.single("foto"),usuarioController.uploadFotoPerfil);
// Atualiza o banner de perfil do usuário logado
router.put("/:id/banner-perfil",authMiddleware,uploadBanner.single("banner"),usuarioController.uploadBannerPerfil);
11

module.exports = router;