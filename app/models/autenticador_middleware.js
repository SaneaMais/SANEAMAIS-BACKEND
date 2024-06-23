const { validationResult } = require("express-validator");
const usuario = require("./UsuarioModel");
const bcrypt = require("bcryptjs");

verificarUsuAutenticado = (req, res, next) => {
    if (req.session.autenticado) {
        var autenticado = req.session.autenticado;
    } else {
        var autenticado = { autenticado: null, id: null, tipo: null };
    }
    req.session.autenticado = autenticado;
    next();
}

limparSessao = (req, res, next) => {
    req.session.destroy();
    next()
}

gravarUsuAutenticado = async (req, res, next) => {
    erros = validationResult(req)
    if (erros.isEmpty()) {
        var dadosForm = {
            email_usuario: req.body.email,
            senha_usuario: req.body.senha,
        };
        var results = await usuario.findUserEmail(dadosForm);
        var total = Object.keys(results).length;
        if (total == 1) {
            if (bcrypt.compareSync(dadosForm.senha_usuario, results[0].senha_usuario)) {
                var autenticado = {
                    autenticado: results[0].nome_usuario,
                    id: results[0].id_usuario,
                };
            }
        } else {
            var autenticado =  { autenticado: null, id: null, tipo: null };
        }
    } else {
        var autenticado =  { autenticado: null, id: null, tipo: null };
    }
    req.session.autenticado = autenticado;
    next();
}

verificarUsuAutorizado = (req, res, next) => {
        if (req.session.autenticado) {
            var autenticado = req.session.autenticado;
        } else  {
            var autenticado = { autenticado: null, id:null, tipo:null};
        }
        req.session.autenticado = autenticado;
        next();
            
           
    };

module.exports = {
    verificarUsuAutenticado,
    limparSessao,
    gravarUsuAutenticado,
    verificarUsuAutorizado
}
