const express = require("express");
const router = express.Router();

const pool = require("../../config/pool_conexoes")

router.get("/", function (req, res) {
  res.render("pages/index", {pagina:"home", logado:null});
});

router.get("/cadastro", function (req, res) {
  res.render("pages/cadastro/index");
});

router.get("/cadastro/cnpj", function (req, res) {
  res.render("pages/cadastro/cnpj");
});

router.get("/esqueceusenha/email", function (req, res) {
  res.render("pages/esqueceusenha/email");
});

router.get("/login", function (req, res) {
  res.render("pages/login/index");
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

router.get("/Publicacao", function (req, res) {
  res.render("pages/Publicacao/publi/index");
});

router.get("/PublicacaoPERFIL", function (req, res) {
  res.render("pages/Publicacao/Perfil/index");
});


module.exports = router;

