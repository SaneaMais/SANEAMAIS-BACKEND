const express = require("express");
const router = express.Router();
const pool = require("../../config/pool_conexoes");
const usuarioController = require("../controllers/UsuarioController");
const admController = require("../controllers/admController");
const InstituController = require('../controllers/InstituController');
const { gravarUsuAutenticado, gravarUsuAutenticadoCadastro, limparSessao, verificarUsuAutorizado } = require('../models/autenticador_middleware');

const upload = require("../util/uploader")();

router.get("/", function (req, res) {
  res.render("pages/index", { pagina: "home", logado: null, autenticado: req.session.autenticado });
});
/* --------------------------------------cadastro------------------------------------------------------------------ */
router.get("/cadastro", function (req, res) {
  res.render("pages/cadastro/index", { listaErros: null, dadosNotificacao: null, dados: null, pagina: "cadastro", logado: null })
});
router.post("/cadastro", usuarioController.regrasValidacao, gravarUsuAutenticadoCadastro, async function (req, res) {
  usuarioController.create(req, res)
});
/* --------------------------------------cadastro------------------------------------------------------------------ */

/* ---------------------------------------login-------------------------------------------------------------------- */
router.get("/login", function (req, res) {
  res.render("pages/login/index", { pagina: "login", logado: null, dados: null, listaErros: null, dadosNotificacao: null });
});
router.post('/login', usuarioController.regrasValidacaoFormLogin, gravarUsuAutenticado, function (req, res) {
  usuarioController.logar(req, res);
})
/* ---------------------------------------login-------------------------------------------------------------------- */

router.get("/cadastro/cnpj", function (req, res) {
  res.render("pages/cadastro/cnpj", { autenticado: req.session.autenticado });
});
router.post("/cadastro/cnpj", InstituController.cadastrar);

router.get("/esqueceusenha/email", verificarUsuAutorizado([1, 3], 'pages/restrito'), function (req, res) {
  res.render("pages/esqueceusenha/email", { autenticado: req.session.autenticado });
});

router.get("/FaleConoco", verificarUsuAutorizado([1, 3], 'pages/restrito'), function (req, res) {
  res.render("pages/FaleConoco/index", { autenticado: req.session.autenticado });
});

router.get("/Servico", verificarUsuAutorizado([1, 3], 'pages/restrito'), function (req, res) {
  res.render("pages/Servico/index", { autenticado: req.session.autenticado });
});

router.get("/Sobre", verificarUsuAutorizado([1, 3], 'pages/restrito'), function (req, res) {
  res.render("pages/Sobre/sobre", { autenticado: req.session.autenticado });
});

router.get("/PublicacacaoCONFIG", verificarUsuAutorizado([1, 3], 'pages/restrito'), function (req, res) {
  res.render("pages/Publicacao/Config/index", { autenticado: req.session.autenticado });
});

/* ---------------------------Publicações----------------------------- */
router.get("/Publicacao", verificarUsuAutenticado, function (req, res) {
  publiController.buscarPublicacoes(req, res);
});

router.post("/Publicacao", verificarUsuAutenticado, (req, res) => {
  publiController.criarPublicacao(req, res);
});

router.get("/PublicacaoPERFIL", verificarUsuAutorizado([1, 3], 'pages/restrito'), function (req, res) {
  res.render("pages/Publicacao/Perfil/index", { autenticado: req.session.autenticado });
});

/* =========================================autenticaão===================================================== */
router.post('/sair', limparSessao, function (req, res) {
  res.redirect('/')
});
router.get('/verificar-autenticacao', verificarUsuAutorizado([1, 3], 'pages/restrito'), function (req, res) {
  TarefasControl.redirectByType(req, res)
})
/* ======================================adm==================================================================*/
router.get("/adm", verificarUsuAutorizado([3], 'pages/restrito'), admController.listarUsuarios);
router.delete("/usuario/:id", verificarUsuAutorizado([3], 'pages/restrito'), admController.removerUsuario);


router.post("/teste", upload("imageInput"), function(req, res){
  console.log(req.body)
  console.log(req.file)
})


module.exports = router;