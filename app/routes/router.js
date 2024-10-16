const express = require("express");
const router = express.Router();
const { body } = require('express-validator');
const usuarioController = require("../controllers/UsuarioController");
const admController = require("../controllers/admController");
const InstituController = require("../controllers/InstituController");
const publiController = require("../controllers/publiController");
const ComentarioController = require("../controllers/comentarioController");
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

// Resetar Senha
router.get("/resetar-senha", (req, res) => {
  usuarioController.validarTokenNovaSenha(req, res);
});
router.post("/reset-senha", usuarioController.regrasValidacaoFormNovaSenha, (req, res) => {
  usuarioController.resetarSenha(req, res);
});

// Comentários
router.post("/comentarios", [
  body("comentarios").notEmpty().withMessage('O comentário não pode estar vazio.').isLength({ max: 500 }).withMessage('O comentário deve ter no máximo 500 caracteres.'),
  body('postId').notEmpty().withMessage('O ID do post é obrigatório.')
], ComentarioController.criarComentario);
router.get("/comentarios/:postId", ComentarioController.buscarComentarios);

router.get("/adm/comentarios", verificarUsuAutorizado([3], 'pages/restrito'), admController.listarComentarios);


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
router.get("/PublicacacaoCONFIG", verificarUsuAutorizado([1, 3], 'pages/restrito'), (req, res) => {
  res.render("pages/Publicacao/Config/index", { autenticado: req.session.autenticado });
});

// Publicações
router.get("/publicacao", verificarUsuAutorizado([1, 2, 3], 'pages/restrito'), async (req, res) => {
  const dadosNotificacao = req.session.dadosNotificacao || null;
  try {
    await publiController.buscarPublicacoes(req, res, dadosNotificacao);
  } catch (error) {
    console.error('Erro ao buscar publicações:', error);
    return res.status(500).send('Erro ao buscar publicações');
  }
});

router.post("/publicacao", upload('imageInput'), async (req, res) => {
  try {
    await publiController.criarPublicacao(req, res);
    
  } catch (error) {
    console.error('Erro ao criar publicação 3:', error);
    req.session.dadosNotificacao = {
      titulo: "Erro!",
      mensagem: "Ocorreu um erro ao tentar criar a publicação.",
      tipo: "error"
    };
    res.redirect("/publicacao");
  }
});

router.get("/adm/publiadm", verificarUsuAutorizado([3], 'pages/restrito'), admController.listarPublicacoes);
router.delete("/adm/publiadm/:id", verificarUsuAutorizado([3], 'pages/restrito'), admController.removerPublicacao);

// Outras Publicações
router.get("/PublicacaoPERFIL", verificarUsuAutorizado([1, 3], 'pages/restrito'), (req, res) => {
  res.render("pages/Publicacao/Perfil/index", { autenticado: req.session.autenticado });
});
router.get("/PublicacaoDOACAO", verificarUsuAutorizado([1, 3], 'pages/restrito'), (req, res) => {
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

module.exports = router;
