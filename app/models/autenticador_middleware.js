const { validationResult } = require("express-validator");
const usuario = require("../models/UsuarioModel");
const bcrypt = require("bcryptjs");

const verificarUsuAutenticado = (req, res, next) => {
    if (req.session.autenticado) {
        var autenticado = req.session.autenticado;
    } else {
        var autenticado = { autenticado: null, id: null, tipo: null };
    }
    req.session.autenticado = autenticado;
    next();
}

const limparSessao = (req, res, next) => {
    req.session.destroy();
    next();
}

const gravarUsuAutenticado = async (req, res, next) => {
    const erros = validationResult(req);
    if (erros.isEmpty()) {
        const errorLogin = {
            errors: [
                { msg: 'Email ou Senha incorreta', path: 'email' },
            ]
        };

        const results = await usuario.findUserEmail(req.body.email);
        const total = Object.keys(results).length;

        if (total === 1) {
            if (bcrypt.compareSync(req.body.senha, results[0].senha_usuario)) {
                var autenticado = {
                    tipo_autenticacao: 'login',
                    autenticado: results[0].nome_usuario,
                    id: results[0].id_usuario,
                    tipo: results[0].tipo_usuario_id
                };
                req.session.autenticado = autenticado; // Armazenando na sessão
                console.log("Usuário autenticado:", req.session.autenticado); // Log de depuração
                return next();
            } else {
                // Erro: senha incorreta
                return res.render("pages/login/index", { listaErros: errorLogin, dados: req.body });
            }
        } else {
            // Erro: email não encontrado
            return res.render("pages/login/index", { listaErros: errorLogin, dados: req.body });
        }
    }
    // Se houver erros de validação
    return res.render("pages/login/index", { listaErros: erros.array(), dados: req.body });
}

const gravarUsuAutenticadoCadastro = (req, res, next) => {
    const erros = validationResult(req);
    if (erros.isEmpty()) {
        var autenticado = {
            tipo_autenticacao: 'cadastro',
            autenticado: req.body.nome,
            tipo: req.body.tipo_usuario_id
        };
        req.session.autenticado = autenticado;
        console.log("Usuário cadastrado:", req.session.autenticado); // Log de depuração
    }
    next();
}

const verificarUsuAutorizado = (tipoPermitido, destinoFalha) => {
    return (req, res, next) => {
        if (req.session?.autenticado && tipoPermitido.includes(req.session.autenticado.tipo)) {
            return next();
        } else {
            console.log("Acesso negado para o tipo:", req.session?.autenticado?.tipo); // Log de depuração
            res.render(destinoFalha, { autenticado: req.session.autenticado });
        }
    }
};

const verificarCadastroCompleto = async (req, res, next) => {
    const autenticado = req.session.autenticado;
    if (autenticado && autenticado.id) {
        const result = await usuario.findByApproved(autenticado.id);
        const isApproved = result.length > 0;

        if (isApproved) {
            return next();
        }
    }
    res.render('pages/restrito', { autenticado });
}

module.exports = {
    verificarUsuAutenticado,
    limparSessao,
    gravarUsuAutenticado,
    verificarUsuAutorizado,
    gravarUsuAutenticadoCadastro,
    verificarCadastroCompleto
}
