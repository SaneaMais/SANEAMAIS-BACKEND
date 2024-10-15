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
                const resultados = await UsuarioModel.create({ ...req.body, nasc: formattedDate, senha: bcrypt.hashSync(req.body.senha, salt) });

                req.session.dadosNotificacao = {
                    titulo: "Enviado",
                    mensagem:`Cadastro feito com sucesso, ${req.session.autenticado.autenticado}`,
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
          return res.render("pages/login/index", {
              pagina: "login",
              dados: req.body,
              listaErros: erros,
              logado: null,
              dadosNotificacao: null
          });
      }
  
      if (req.session.autenticado != null) {
          if (req.session.autenticado.tipo === 1) {
              req.session.dadosNotificacao = {
                  titulo: "Login feito com sucesso",
                  mensagem: `Bem-vindo de volta, ${req.session.autenticado.autenticado}`,
                  tipo: "success"
              };
              res.redirect("/publicacao");
          } else if (req.session.autenticado.tipo === 2) {
              req.session.dadosNotificacao = {
                  titulo: "Login feito com sucesso",
                  mensagem: `Bem-vindo de volta, Empresa ${req.session.autenticado.autenticado}`,
                  tipo: "success"
              };
              res.redirect("/publicacao"); 
              
          } else if (req.session.autenticado.tipo === 3) {
              req.session.dadosNotificacao = {
                  titulo: "Login feito com sucesso",
                  mensagem: `Bem-vindo de volta ADM`,
                  tipo: "success"
              };
              res.redirect("/adm");
          } else {
              res.render("pages/login/index", {
                  listaErros: null,
                  logado: null,
                  dados: null,
                  dadosNotificacao: { titulo: "error", mensagem: "Usuário não permitido", tipo: "erros" }
              });
          }
      } else {
          res.render("pages/login/index", {
              listaErros: null,
              dados: null,
              logado: null,
              dadosNotificacao: { titulo: "error", mensagem: "Usuário ou senha inválido", tipo: "erros" }
          });
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

    regrasValidacaoFormNovaSenha: [
    body("senha")
    .isStrongPassword()
    .withMessage(
        "A senha deve ter no mínimo 8 caracteres (mínimo 1 maiúscula, 1 caractere especial e 1 número)"
        )
        .custom(async (value, { req }) => {
            if (value !== req.body.c-senha) {
                throw new Error("As senhas não são iguais!");
            }
        }),
        body("c-senha")
        .isStrongPassword()
        .withMessage(
            "A senha deve ter no mínimo 8 caracteres (mínimo 1 letra maiúscula, 1 caractere especial e 1 número)"
        ),
    ],

    regrasValidacaoFormRecSenha: [
        body("email_usuario")
          .isEmail()
          .withMessage("Digite um e-mail válido!")
          .custom(async (value) => {
            const nomeUsu = await usuario.findCampoCustom({ email_usuario: value });
            if (nomeUsu == 0) {
              throw new Error("E-mail não encontrado");
            }
          }),
      ],

      recuperarSenha: async (req, res) => {
        const erros = validationResult(req);
        console.log(erros);
        if (!erros.isEmpty()) {
          return res.render("pages/rec-senha", {
            listaErros: erros,
            dadosNotificacao: null,
            valores: req.body,
          });
        }
        try {
            //logica do token
            user = await usuario.findUserCustom({
              email_usuario: req.body.email_usu,
            });
            const token = jwt.sign(
              { userId: user[0].id_usuario, expiresIn: "40m" },
              process.env.SECRET_KEY
            );
            //enviar e-mail com link usando o token
            html = require("../util/email-reset-senha")(process.env.URL_BASE, token)
            enviarEmail(req.body.email_usu, "Pedido de recuperação de senha", null, html, ()=>{
              return res.render("pages/index", {
                listaErros: null,
                autenticado: req.session.autenticado,
                dadosNotificacao: {
                  titulo: "Recuperação de senha",
                  mensagem: "Enviamos um e-mail com instruções para resetar sua senha",
                  tipo: "success",
                },
              });
            });
      
          } catch (e) {
            console.log(e);
          }
        },
        validarTokenNovaSenha: async (req, res) => {
            //receber token da URL
        
            const token = req.query.token;
            console.log(token);
            //validar token
            jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
              if (err) {
                res.render("pages/rec-senha", {
                  listaErros: null,
                  dadosNotificacao: { titulo: "Link expirado!", mensagem: "Insira seu e-mail para iniciar o reset de senha.", tipo: "error", },
                  valores: req.body
                });
              } else {
                res.render("pages/resetar-senha", {
                  listaErros: null,
                  autenticado: req.session.autenticado,
                  id_usuario: decoded.userId,
                  dadosNotificacao: null
                });
              }
            });
          },
        
          resetarSenha: async (req, res) => {
            const erros = validationResult(req);
            console.log(erros);
            if (!erros.isEmpty()) {
              return res.render("pages/resetar-senha", {
                listaErros: erros,
                dadosNotificacao: null,
                valores: req.body,
              });
            }
            try {
              //gravar nova senha
              senha = bcrypt.hashSync(req.body.senha_usu);
              const resetar = await usuario.update({ senha_usuario: senha }, req.body.id_usuario);
              console.log(resetar);
              res.render("pages/login", {
                listaErros: null,
                dadosNotificacao: {
                  titulo: "Perfil alterado",
                  mensagem: "Nova senha registrada",
                  tipo: "success",
                },
              });
            } catch (e) {
              console.log(e);
            }
          },



    



}
/* --------------------------login----------------------------------------- */

module.exports = UsuarioController;
