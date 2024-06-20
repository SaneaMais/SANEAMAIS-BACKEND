const usuario = require("../models/usuarioModel");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
var salt = bcrypt.genSaltSync(12);
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
const https = require('https');
const usuarioModel = require("../models/usuarioModel");

const usuarioController = {

    CriarUsuario: async (req,res) => {
        const { data_nasc } = req.body
        if (data_nasc) {
            const date = new Date(data_nasc)
            req.body.data_nasc = date.toISOString().split('T')[0]
        }

    const errors = validationResult(req);
    if(!errors.isEmpty()) {
    return res.render('pages/cadastro' , {
        dados: req.body,
        listaErros: errors,
        logado:null
    });
}

    try {
        const result = await UsuarioModel.create({ ...req.body, senha: bcrypt.hashSync(req.body.senha) });
        req.session.autenticado.id = result[0].insertId

        req.flash('success' , `Bem vindo, ${req.body.nome}`)

        res.redirect('/verificar-autenticacao')
    } catch (error) {
        return error;
    }
},


    regrasValidacaoFormLogin: [
        body("user")
            .isLength({ min: 8, max: 45 })
            .withMessage("O nome de usuário/e-mail deve ter de 8 a 45 caracteres"),
        body("senha_usuario")
            .isStrongPassword()
            .withMessage("A senha deve ter no mínimo 8 caracteres (mínimo 1 letra maiúscula, 1 caractere especial e 1 número)")
    ],



    regrasValidacaoFormCad: [
        body("nome")
            .isLength({ min: 3, max: 45 }).withMessage("Nome deve ter de 3 a 45 caracteres!"),
            
        body("data_nasc")
            .isLength({ min: 10}).withMessage('Data inválida')
            .toDate() 
            .withMessage('Data inválida')
            .custom( value => {
                const birthDate = new Date (value);
                if (isNaN(birthDate.getTime())) {
                  throw new Error('Data de nascimento inválida!');
                }
           const today = new Date();
           let age = today.getFullYear() - birthDate.getFullYear();
           const monthDiff = today.getMonth() - birthDate.getMonth();
           if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate()) ) {
            age--;

           }
           if (age < 16) {
            throw new Error('Você deve ter pelo menos 16 anos!');
           }

           return true
            }),  


        body("email")
            .isEmail().withMessage("Digite um e-mail válido!")
            .custom(async value => {
                const email = await UsuarioModel.findCampoEmail(value)
                if (email.length > 0) {
                  throw new Error('E-mail em uso!');
                }
                return true;
              }),

        body("senha")
        .isLength({ min: 8, max: 30})
        .withMessage("A senha deve ter no mínimo 8 caracteres")
        .bail()
        .matches(/^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])/)
        .withMessage("Senha inválida! (mínimo 1 letra maiúscula, 1 caractere especial e 1 número)")
    ],

    logar: (req, res) => {
        const erros = validationResult(req);
        if (!erros.isEmpty()) {
            return res.render("pages/login", { listaErros: erros, dados: req.body  })
        }
        if (req.session.autenticado != null) {
            return res.render("pages/Publicacao", { listaErros: erros, dados: null  })
        }
            req.flash('success' , 'Bem vindo!')
           
            res.redirect('/verificar-autenticacao')

    },


    regrasValidacaoFormLogin: [
        body("email")
        .isEmail()
        .withMessage("Email inválido"), 

       /* body("user")
          .isUser()
          .withMessage("Usuário inválido"), /** */

        body("senha")
        .isLength({ min: 8, max: 30})
        .withMessage("A senha deve ter no mínimo 8 caracteres")
        .bail()
        .matches(/^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])/)
        .withMessage("Senha inválida! (mínimo 1 letra maiúscula, 1 caractere especial e 1 número)"),
        
    ],

    
}

module.exports = usuarioController;