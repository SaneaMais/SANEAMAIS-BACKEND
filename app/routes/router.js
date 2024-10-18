const express = require("express");
const router = express.Router();
const { body } = require('express-validator');
const usuarioController = require("../controllers/UsuarioController");
const admController = require("../controllers/admController");
const InstituController = require("../controllers/InstituController");
const publiController = require("../controllers/publiController");
const ComentarioController = require("../controllers/comentarioController");
const RankingModel = require("../models/RankingModel");

const { gravarUsuAutenticado, gravarUsuAutenticadoCadastro, limparSessao, verificarUsuAutorizado, verificarUsuAutenticado } = require('../models/autenticador_middleware');
const upload = require("../util/uploader")();

// Rota inicial
router.get("/", (req, res) => {
  res.render("pages/index", { pagina: "home", logado: null, autenticado: req.session.autenticado });
});

// Cadastro
router.get("/cadastro", (req, res) => {
  res.render("pages/cadastro/index", { listaErros: null, dadosNotificacao: null, dados: null, pagina: "cadastro", logado: null });
});
router.post("/cadastro", usuarioController.regrasValidacao, gravarUsuAutenticadoCadastro, (req, res) => {
  usuarioController.create(req, res);
});

// Cadastro CNPJ
router.get("/cadastro/cnpj", (req, res) => {
  res.render("pages/cadastro/cnpj", { listaErros: null, dadosNotificacao: null, dados: null, pagina: "cadastro/cnpj", logado: null });
});
router.post("/cadastro/cnpj", InstituController.regrasValidacao, gravarUsuAutenticadoCadastro, (req, res) => {
  InstituController.cadastrar(req, res);
});

// Login
router.get("/login", (req, res) => {
  res.render("pages/login/index", { pagina: "login", logado: null, dados: null, listaErros: null, dadosNotificacao: null });
});
router.post('/login', usuarioController.regrasValidacaoFormLogin, gravarUsuAutenticado, (req, res) => {
  usuarioController.logar(req, res);
});
//esqueceu senha
 router.get("/esqueceusenha/email", function (req, res) {
 
   res.render("pages/esqueceusenha/email", { autenticado: req.session.autenticado });
 
 });
 
// Resetar Senha
// router.get("/resetar-senha", (req, res) => {
//   usuarioController.validarTokenNovaSenha(req, res);
// });
// router.post("/reset-senha", usuarioController.regrasValidacaoFormNovaSenha, (req, res) => {
//   usuarioController.resetarSenha(req, res);
// });
router.get("/recuperar-senha", verificarUsuAutenticado, function(req, res){
  res.render("pages/rec-senha",{ listaErros: null, dadosNotificacao: null });
});

router.post("/recuperar-senha",
  verificarUsuAutenticado,
  usuarioController.regrasValidacaoFormRecSenha, 
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


// Comentários
router.post("/comentarios", [
  body("comentarios").notEmpty().withMessage('O comentário não pode estar vazio.').isLength({ max: 500 }).withMessage('O comentário deve ter no máximo 500 caracteres.'),
  body('postId').notEmpty().withMessage('O ID do post é obrigatório.')
], ComentarioController.criarComentario);
router.get("/comentarios/:postId", ComentarioController.buscarComentarios);

router.get("/adm/comentarios", verificarUsuAutorizado([3], 'pages/restrito'), admController.listarComentarios);
router.delete("/adm/comentarios/:id", admController.removerComentario);

// Demais páginas (com autorização)
router.get("/FaleConoco", verificarUsuAutorizado([1, 3], 'pages/restrito'), (req, res) => {
  res.render("pages/FaleConoco/index", { autenticado: req.session.autenticado });
});
router.get("/Servico", verificarUsuAutorizado([1, 3], 'pages/restrito'), (req, res) => {
  res.render("pages/Servico/index", { autenticado: req.session.autenticado });
});
router.get("/Sobre", verificarUsuAutorizado([1, 3], 'pages/restrito'), (req, res) => {
  res.render("pages/Sobre/sobre", { autenticado: req.session.autenticado });
});

// router.get("/PublicacacaoCONFIG", verificarUsuAutorizado([1, 3], 'pages/restrito'), function (req, res) {
//   res.render("pages/Publicacao/Config/index", { autenticado: req.session.autenticado });
// });

/* ---------------------------Publicações----------------------------- */
router.get("/publicacao", async (req, res) => {
  const dadosNotificacao = req.session.dadosNotificacao || null;
  try {
    await publiController.buscarPublicacoes(req, res, dadosNotificacao);
  } catch (error) {
    console.error('Erro ao buscar publicações:', error);
    return res.status(500).send('Erro ao buscar publicações');
  }
});

router.post("/publicacao", upload('imageInput'), async (req, res) => {
  await publiController.criarPublicacao(req, res);
});

router.get("/adm/publiadm", verificarUsuAutorizado([3], 'pages/restrito'), admController.listarPublicacoes);
router.delete("/adm/publiadm/:id", admController.removerPublicacao);

/* ---------------------------Publicações----------------------------- */

router.get("/PublicacaoPERFIL", publiController.buscarPublicacoesUsuario);


router.get("/PublicacaoDOACAO", function (req, res) {
  res.render("pages/Publicacao/Doacao/index", { autenticado: req.session.autenticado });
});

// Logout
router.post('/sair', limparSessao, (req, res) => {
  res.redirect('/');
});
router.get('/verificar-autenticacao', verificarUsuAutorizado([1, 3], 'pages/restrito'), (req, res) => {
  TarefasControl.redirectByType(req, res);
});

// Admin
router.get("/adm", verificarUsuAutorizado([3], 'pages/restrito'), admController.listarUsuarios);
router.delete("/usuario/:id", verificarUsuAutorizado([3], 'pages/restrito'), admController.removerUsuario);

/* ======================================configuraçoes==================================================================*/
router.get(
  "/PublicacacaoCONFIG",
  verificarUsuAutorizado([1, 2, 3], "pages/restrito"),
  async function (req, res) {
    usuarioController.mostrarPerfil(req, res);
  }
);

router.post(
  "/PublicacacaoCONFIG",
  upload("profileImage"),
  usuarioController.regrasValidacaoPerfil,
  verificarUsuAutorizado([1, 2, 3], "pages/restrito"),
  async function (req, res) {
    usuarioController.gravarPerfil(req, res);
  }
);

// Ranking
router.get('/api/ranking', async (req, res) => {
  try {
      // Busca o ranking de cidades no model
      const cidadesRanking = await RankingModel.getRanking();

      // Verifica se há resultados
      if (cidadesRanking.length === 0) {
          return res.status(404).json({ message: 'Nenhuma cidade encontrada no ranking.' });
      }

      // Retorna o ranking em formato JSON
      res.status(200).json(cidadesRanking);
  } catch (error) {
      console.error('Erro ao buscar o ranking:', error);
      res.status(500).json({ error: 'Erro ao buscar o ranking.' });
  }
});

module.exports = router;
