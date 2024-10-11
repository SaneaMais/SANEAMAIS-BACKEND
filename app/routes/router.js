const express = require("express");
const router = express.Router();
const pool = require("../../config/pool_conexoes");
const usuarioController = require("../controllers/UsuarioController");
const admController = require("../controllers/admController");
const InstituController = require("../controllers/InstituController");
const publiController = require("../controllers/publiController");
const { gravarUsuAutenticado, gravarUsuAutenticadoCadastro, limparSessao, verificarUsuAutorizado, verificarUsuAutenticado } = require('../models/autenticador_middleware');

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

router.get("/cadastro/cnpj", function (req, res) {
  res.render("pages/cadastro/cnpj", { listaErros: null, dadosNotificacao: null, dados: null, pagina: "cadastro/cnpj", autenticado: req.session.autenticado });
});

router.post("/cadastro/cnpj", InstituController.regrasValidacao, gravarUsuAutenticadoCadastro, async function (req, res) {
  InstituController.cadastrar(req, res)
});
/* ---------------------------------------login-------------------------------------------------------------------- */
router.get("/login", function (req, res) {
  res.render("pages/login/index", { pagina: "login", logado: null, dados: null, listaErros: null, dadosNotificacao: null });
});
router.post('/login', usuarioController.regrasValidacaoFormLogin, gravarUsuAutenticado, function (req, res) {
  usuarioController.logar(req, res);
})
/* ---------------------------------------login-------------------------------------------------------------------- */

router.get("/esqueceusenha/email", verificarUsuAutorizado([1, 3], 'pages/restrito'), function (req, res) {
  res.render("pages/esqueceusenha/email", { autenticado: req.session.autenticado });
});

router.get("/recuperar-senha", verificarUsuAutenticado, function(req, res){
  res.render("pages/rec-senha", { listaErros: null, dadosNotificacao: null});
});

router.post("/recuperar-senha",
verificarUsuAutenticado,
usuarioController.regrasValidacaoFormsRecSenha,
function(req, res){
  usuarioController.recuperarSenha(req, res);
});

router.get("/resetar-senha",
function(req, res){
  usuarioController.validarTokenNovaSenha(req, res);
});

router.post("/reset-senha",
usuarioController.regrasValidacaoFormNovaSenha,
function(req, res){
  usuarioController.resetarSenha(req, res);
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
router.get("/publicacao", verificarUsuAutorizado([1, 3], 'pages/restrito'), async (req, res) => {
  const dadosNotificacao = req.session.dadosNotificacao || null;
  delete req.session.dadosNotificacao;

  try {
      const posts = await publiController.buscarPublicacoes(req); // Altere aqui
      console.log(posts);
      return res.render('pages/publicacao/publi/index', {
          listaErros: null,
          dadosNotificacao: dadosNotificacao,
          dados: posts, // Passa as publicações para a renderização
          pagina: 'publicacao',
          logado: req.session.autenticado,
          autenticado: req.session.autenticado,
      });
  } catch (error) {
      console.error('Erro ao buscar publicações:', error);
      return res.status(500).send('Erro ao buscar publicações');
  }
});

router.post("/publicacao", upload('imageInput'), async (req, res) => {
  await publiController.criarPublicacao(req, res);
});
/* ---------------------------Publicações----------------------------- */


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




module.exports = router;