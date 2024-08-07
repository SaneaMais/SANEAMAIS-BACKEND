const UsuarioModel = require("../models/UsuarioModel");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const salt = bcrypt.genSaltSync(12);
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
const https = require('https');


const UsuarioController = {

    CriarUsuario: (req,res) => {
        const { data_nasc } = req.body
        if (data_nasc) {
            const date = new Date(data_nasc)
            req.body.data_nasc = date.toISOString().split('T')[0]
        }

    const erros = validationResult(req);
    console.log(erros)
    var dadosForm = {
        nome_usuario: req.body.nome,
        senha_usuario: bcrypt.hashSync(req.body.senha, salt),
        user_usuario: req.body.user,
        email_usuario: req.body.email,
        data_nasc_usuario: req.body.data_nasc,
        cep_usuario: req.body.cep,
    };
    console.log(dadosForm)
      if (!erros.isEmpty()) {
        return res.render("pages/cadastro/index", {listaErros: erros, dadosNotificacao: null, valores: req.body, dados:null})
      }  
    try {
        let create = UsuarioModel.create(dadosForm);
        console.log(create)
        res.render("pages/cadastro/index", {
            listaErros: null, dados:null, dadosNotificacao: {
                titulo: "Cadastro realizado!", mensagem: "Novo usuário cadastrado com sucesso!", tipo: "success"
            }, valores: req.body
        })
    } catch (error) {
        console.log(error);
        res.render("pages/cadastro/index", {
            listaErros: erros, dados:null, dadosNotificacao: {
                titulo: "Erro ao cadastrar!", mensagem: "Verifique os dados digitados ", tipo: "error"
             }, valores: req.body 
        })
    }
},

    regrasValidacaoFormLogin: [
        body("user")
            .isLength({ min: 8, max: 45 })
            .withMessage("O nome de usuário/e-mail deve ter de 8 a 45 caracteres"),
        body("senha_usuario")
            .isStrongPassword()
            .bail()
            .matches(/^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])/)
            .withMessage("Senha inválida! (mínimo 1 letra maiúscula, 1 caractere especial e 1 número)"),
            
    ],


    regrasValidacaoFormCad: [
        body("nome")
            .isLength({ min: 3, max: 45 }).withMessage("Nome deve ter de 3 a 45 caracteres!"),
            body("user")
            .isLength({ min: 8, max: 45 }).withMessage("Nome de usuário deve ter de 8 a 45 caracteres!")
            .custom(async value => {
                const user = await UsuarioModel.findUserUsuario({'user_usuario':value});
                if (user > 0) {
                    throw new Error('Nome de usuário já em uso!');
                }
            }),

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
                const email = await UsuarioModel.findUserEmail({'email_usuario' :value});
                if (email > 0) {
                  throw new Error('E-mail em uso!');
                }
              }),

        body("senha")
        .isStrongPassword()
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
        if (req.session.autenticado.autenticado != null) {
            return res.redirect("pages/Publicacao");
        }else {
            res.render("pages/login", {listaErros: null,
                dadosNotificacao: {titulo: "falha ao logar!", mensagem: "Usuário e/ou senha inválidos", tipo: "error"}})
        }
    },

}

module.exports = UsuarioController