const UsuarioModel = require("../models/UsuarioModel");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const salt = bcrypt.genSaltSync(12);
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
const https = require('https');
const moment = require('moment');

const UsuarioController = {

    /* --------------------------cadastro-------------------------------------- */
    create: async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                console.log(errors);
                return res.render("pages/cadastro/index", {
                    dados: req.body,
                    listaErros: errors,
                    pagina: "cadastro",
                    dadosNotificacao: null
                });
            }
            
            const nascimento = req.body.nasc;
            const formattedDate = moment(nascimento, 'DD/MM/YYYY').format('YYYY-MM-DD');

            try {
                const resultados = await UsuarioModel.create({
                    ...req.body,
                    nasc: formattedDate,
                    senha: bcrypt.hashSync(req.body.senha, salt)
                });

                req.session.dadosNotificacao = {
                    titulo: "Enviado",
                    mensagem: "Cadastro feito com sucesso",
                    tipo: "success"
                };
                res.redirect("/publicacao");

            } catch (error) {
                console.error(error);
                return res.status(500).send("Erro no servidor.");
            }
        } catch (error) {
            console.error(error);
            return res.status(500).send("Erro no servidor.");
        }
    },
    regrasValidacao: [
        body("nome")
            .isLength({ min: 3, max: 45 })
            .withMessage("Nome inválido"),
        body("email")
            .isEmail()
            .withMessage("Email inválido")
            .custom(async (value) => {
                const email = await UsuarioModel.findUserEmail(value);
                if (email.length > 0) {
                    throw new Error('Email já utilizado.');
                }
                return true;
            }),
        body("user")
            .isLength({ min: 8, max: 45 })
            .withMessage("Nome de usuário deve conter pelo menos 8 letras")
            .bail()
            .custom(async (value) => {
                const user = await UsuarioModel.findUserByUsername(value);
                if (user.length > 0) {
                    throw new Error('Nome de usuário já está em uso.');
                }
                return true;
            }),
        body("nasc")
            .custom(value => {
                if (!moment(value, 'DD/MM/YYYY', true).isValid()) {
                    throw new Error('Data de nascimento inválida!');
                }

                const birthDate = moment(value, 'DD/MM/YYYY').toDate();
                const today = new Date();
                let age = today.getFullYear() - birthDate.getFullYear();
                const monthDiff = today.getMonth() - birthDate.getMonth();
                if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
                    age--;
                }
                if (age < 16) {
                    throw new Error('Você deve ter pelo menos 16 anos!');
                }
                return true;
            }),
        body("senha")
            .isLength({ min: 8, max: 30 })
            .withMessage("Senha inválida, deve conter pelo menos 8 caracteres")
            .bail()
            .matches(/^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])/)
            .withMessage("Senha inválida, deve conter pelo menos 1 letra, 1 número e 1 caractere especial"),
        body("c-senha")
            .notEmpty()
            .withMessage('Campo vazio.')
            .bail()
            .custom((value, { req }) => {
                const senha = req.body.senha;
                if (value != senha) {
                    throw new Error('Senhas diferentes.');
                }
                return true;
            })
    ],

    /* --------------------------cadastro-------------------------------------- */
    /* --------------------------login----------------------------------------- */

    logar: (req, res) => {
        const erros = validationResult(req);
        if (!erros.isEmpty()) {
            return res.render("pages/login/index", { pagina: "login", dados: req.body, listaErros: erros, logado: null, dadosNotificacao: null })
        }
    },
    regrasValidacaoFormLogin: [
        body("email")
            .isEmail()
            .withMessage("Email invalido "),
        body("senha")
            .isLength({ min: 8, max: 30 })
            .withMessage("Senha inválida, deve conter pelo menos 8 caracteres")
            .bail()
            .matches(/^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])/)
            .withMessage("Senha inválida, deve conter pelo menos 1 letra, 1 número e 1 caractere especial"),
    ],
};
/* --------------------------login----------------------------------------- */
module.exports = UsuarioController;
