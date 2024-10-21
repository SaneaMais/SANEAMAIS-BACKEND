const express = require("express");
const app = express();
const port = 3000;

const env = require("dotenv").config();
var session = require("express-session");

app.use(express.static("./app/public"));

app.set("view engine", "ejs");
app.set("views", "./app/views");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));



app.use(
  session({
    secret: "HELLonODE",
    resave: false,
    saveUninitialized: true,
    cookie: {secure: false}
  }));

  
var rotas = require("./app/routes/router");
// const UsuarioController = require("./app/controllers/UsuarioController");
app.use("/", rotas);

app.listen(port, () => {
  console.log(`Servidor online\nhttp://localhost:${port}`);
});
