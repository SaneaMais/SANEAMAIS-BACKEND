const express = require("express");
const router = express.Router();

const pool = require("../../config/pool_conexoes")

router.get("/", function (req, res) {
  res.render("pages/index", {pagina:"home", logado:null});
});



module.exports = router;

