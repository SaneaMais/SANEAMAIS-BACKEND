const express = require("express");
const router = express.Router();
const pool = require("../../config/pool_conexoes");
const usuarioController = require("../controllers/UsuarioController");
const {gravarUsuAutenticado, gravarUsuAutenticadoCadastro, limparSessao, verificarUsuAutorizado} = require('../models/autenticador_middleware');

router.get("/", function (req, res) {
  res.render("pages/index", { pagina: "home", logado: null });
});
/* --------------------------------------cadastro------------------------------------------------------------------ */
router.get("/cadastro", function (req, res) {
  res.render("pages/cadastro/index", {listaErros: null, dadosNotificacao: null, dados: null, pagina: "cadastro", logado: null })
});
router.post("/cadastro", usuarioController.regrasValidacao,gravarUsuAutenticadoCadastro ,async function (req, res) {
  usuarioController.create(req,res)
});
/* --------------------------------------cadastro------------------------------------------------------------------ */

/* ---------------------------------------login-------------------------------------------------------------------- */
router.get("/login", function (req, res) {
  res.render("pages/login/index",{pagina:"login", logado:null, dados: null, listaErros: null, dadosNotificacao: null});
});
router.post('/login', usuarioController.regrasValidacaoFormLogin, gravarUsuAutenticado ,function (req, res) {
  usuarioController.logar(req, res);
})
/* ---------------------------------------login-------------------------------------------------------------------- */

router.get("/cadastro/cnpj", function (req, res) {
  res.render("pages/cadastro/cnpj");
});

router.get("/esqueceusenha/email", function (req, res) {
  res.render("pages/esqueceusenha/email");
});

router.get("/FaleConoco", function (req, res) {
  res.render("pages/FaleConoco/index");
});

router.get("/Servico", function (req, res) {
  res.render("pages/Servico/index");
});

router.get("/Sobre", function (req, res) {
  res.render("pages/Sobre/sobre");
});

router.get("/PublicacacaoCONFIG", function (req, res) {
  res.render("pages/Publicacao/Config/index");
});

router.get("/publicacao", function (req, res) {
  const dadosNotificacao = req.session.dadosNotificacao || null;
  delete req.session.dadosNotificacao; 
  res.render("pages/publicacao/publi/index", {
      listaErros: null,
      dadosNotificacao: dadosNotificacao,
      dados: null,
      pagina: "publicacao",
      logado: null
  });
});

router.get("/PublicacaoPERFIL", function (req, res) {
  res.render("pages/Publicacao/Perfil/index");
});

/* =========================================autenticaão===================================================== */
router.post('/sair', limparSessao, function (req, res) {
  res.redirect('/')
}); 
router.get('/verificar-autenticacao', verificarUsuAutorizado([1, 3], 'pages/restrito'), function (req, res) {
  TarefasControl.redirectByType(req, res)
})
/* ======================================adm==================================================================*/
router.get("/adm", verificarUsuAutorizado([3], 'pages/restrito'), function (req, res) {
  const dadosNotificacao = req.session.dadosNotificacao || null;
  delete req.session.dadosNotificacao; 

  res.render("pages/adm/adm", {dadosNotificacao:dadosNotificacao, logado:null, autenticado: req.session.autenticado});
})

module.exports = router;