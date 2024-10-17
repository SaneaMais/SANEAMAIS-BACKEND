const InstituicaoModel = require('../models/InstituModel');
const UsuarioModel = require('../models/UsuarioModel');
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const moment = require('moment');
const salt = bcrypt.genSaltSync(12);

const InstituicaoController = {
    cadastrar: async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.render("pages/cadastro/cnpj", {
                    dados: req.body,
                    listaErros: errors,
                    pagina: "cadastro/cnpj",
                    dadosNotificacao: null
                });
            }

            const { razao_social_instituicao, cnpj_instituicao, cidade, email, user, senha } = req.body;

            // Dados do usuário para cadastro
            let dadosFormularioUsuario = {
                nome: null,
                email: email,
                user: user,
                cidade: cidade,
                nasc: null,
                senha: bcrypt.hashSync(senha, salt),
                tipo_usuario_id: 2 // Define como empresa
            };

            // Inserir usuário primeiro
            const insertUsuario = await UsuarioModel.create(dadosFormularioUsuario);
            const usuarioId = insertUsuario.insertId;

            // Inserir instituição
            await InstituicaoModel.cadastrarInstituicao(razao_social_instituicao, cnpj_instituicao, usuarioId);

            // Atualizando a sessão do usuário autenticado
            req.session.autenticado = {
                tipo_autenticacao: 'cadastro',
                autenticado: user,
                id: usuarioId,
                tipo: 2 // Tipo de usuário para empresa
            };

            req.session.dadosNotificacao = {
                titulo: "Sucesso",
                mensagem: `Cadastro feito com sucesso, ${user}`,
                tipo: "success"
            };

            res.redirect("/publicacao");

        } catch (error) {
            console.error('Erro ao cadastrar instituição:', error.message);
            res.status(500).send('Erro no servidor ao cadastrar a instituição.');
        }
    },

  regrasValidacao: [
        body("razao_social_instituicao")
            .isLength({ min: 3, max: 100 })
            .withMessage("Razão social inválida, deve conter entre 3 e 100 caracteres"),
        body("cnpj_instituicao")
            .isLength({ min: 14, max: 14 })
            .withMessage("CNPJ inválido")
            .bail()
            .custom(async (value) => {
                const cnpj = await InstituicaoModel.findByCNPJ(value);
                if (cnpj.length > 0) {
                    throw new Error('CNPJ já cadastrado.');
                }
                return true;
            }),

        body("cidade")
            .isLength({ min: 2, max: 45 })
            .withMessage("Cidade inválida"),

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
            .custom(async (value) => {
                const user = await UsuarioModel.findUserByUsername(value);
                if (user.length > 0) {
                    throw new Error('Nome de usuário já está em uso.');
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
            .withMessage('Campo de confirmação de senha vazio.')
            .custom((value, { req }) => {
                if (value !== req.body.senha) {
                    throw new Error('Senhas diferentes.');
                }
                return true;
            })
    ]
}

module.exports = InstituicaoController;
