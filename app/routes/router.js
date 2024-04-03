const express = require("express");
const router = express.Router();

const pool = require("../../config/pool_conexoes")

router.get("/", function (req, res) {
  res.render("pages/index", {pagina:"home", logado:null});
});

router.get("/cadastro", function (req, res) {
  res.render("pages/cadastro/index");
});

router.get("/login", function (req, res) {
  res.render("pages/login/index");
});

router.get("/FaleConoco", function (req, res) {
  res.render("pages/FaleConoco/index");
});

router.get("/Serviço", function (req, res) {
  res.render("pages/Serviço/servicos");
}); //.esse ta dando erro//

router.get("/Sobre", function (req, res) {
  res.render("pages/Sobre/sobre");
});

router.get("/login/index", function (req, res) {
  res.render("pages/Publicacao/publicacao/index");
});

router.get("/Publicacao", function (req, res) {
  res.render("pages/Publicacao/Config/index");
});

router.get("/Publicacao", function (req, res) {
  res.render("pages/Publicacao/Perfil/index");
});


module.exports = router;

