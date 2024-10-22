const { validationResult } = require("express-validator");
const usuario = require("../models/UsuarioModel");
const bcrypt = require("bcryptjs");

const verificarUsuAutenticado = (req, res, next) => {
    if (!req.session.autenticado) {
        req.session.autenticado = { autenticado: null, id: null, tipo: null };
    }
    next();
};


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
                // Capturando a foto do usuário
                let fotoBuffer = results[0].foto_usuario; // Buffer da foto
                let fotoDataUrl = null;

                // Verificando se a foto existe e convertendo para data URL
                if (fotoBuffer) {
                    const base64Image = fotoBuffer.toString('base64'); // Converte para base64
                    fotoDataUrl = `data:image/jpeg;base64,${base64Image}`; // Cria a data URL
                }

                // Armazenando informações na sessão
                var autenticado = {
                    tipo_autenticacao: 'login',
                    autenticado: results[0].user_usuario,
                    id: results[0].id_usuario,
                    tipo: results[0].tipo_usuario_id,
                    foto: fotoDataUrl // Armazenando a foto como data URL na sessão
                };

                req.session.autenticado = autenticado; // Armazenando na sessão
                console.log("Usuário autenticado:", req.session.autenticado); // Log de depuração
                return next();
            } else {
                return res.render("pages/login/index", { listaErros: errorLogin, dados: req.body });
            }
        } else {
            return res.render("pages/login/index", { listaErros: errorLogin, dados: req.body });
        }
    } else {
        var autenticado = { autenticado: null, id: null, tipo: null };
        req.session.autenticado = autenticado;
        return res.render("pages/login/index", {
            pagina: "login",
            dados: req.body,
            listaErros: erros,
            logado: null,
            dadosNotificacao: null
        });
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
