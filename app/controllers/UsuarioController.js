const UsuarioModel = require("../models/UsuarioModel");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const salt = bcrypt.genSaltSync(12);
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
const https = require('https');
const moment = require('moment');
const {removeImg} = require("../util/removeImg");
const jwt = require("jsonwebtoken");
const { enviarEmail } = require("../util/email");
const nodemailer = require('nodemailer');


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

        // Prepara os dados para inserção
        const dadosFormularioUsuario = {
            nome: req.body.nome, // Assumindo que você tenha um campo nome no formulário
            email: req.body.email,
            user: req.body.user, // O nome de usuário
            cidade: req.body.cidade,
            nasc: formattedDate,
            senha: bcrypt.hashSync(req.body.senha, salt),
            tipo_usuario_id: 1 // Define como usuário comum
        };

        try {
            const resultados = await UsuarioModel.create(dadosFormularioUsuario);

            // Atualizando a sessão com o usuário cadastrado
            req.session.autenticado = {
                tipo_autenticacao: 'cadastro',
                autenticado: dadosFormularioUsuario.user, // Acesso ao user do formulário
                id: resultados.insertId, // ID do usuário inserido
                tipo: 1 // Tipo de usuário para comum
            };

            // Mensagem de notificação após cadastro
            req.session.dadosNotificacao = {
                titulo: "Sucesso",
                mensagem: `Cadastro feito com sucesso, ${dadosFormularioUsuario.user}`, // Exibe o nome de usuário
                tipo: "success"
            };

            res.redirect("/publicacao");
        } catch (error) {
            console.error(error);
            return res.status(500).send("Erro no servidor ao cadastrar o usuário.");
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
        console.log(req.session.autenticado);
      const erros = validationResult(req);
      console.log(erros)
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
                pagina: "login",
                  listaErros: null,
                  logado: null,
                  dados: null,
                  dadosNotificacao: { titulo: "error", mensagem: "Usuário não permitido", tipo: "erros" }
              });
          }
      } else {
          res.render("pages/login/index", {
            pagina: "login",
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
                .withMessage("A senha deve ter no mínimo 8 caracteres (mínimo 1 letra maiúscula, 1 caractere especial e 1 número)"),
            body("c-senha")
                .custom((value, { req }) => {
                    if (value !== req.body.senha) {
                        throw new Error('A confirmação de senha deve ser igual à senha.');
                    }
                    return true;
                })
          ],


//       body("senha")
//           .isStrongPassword()
//           .withMessage(
//               'A senha deve ter no mínimo 8 caracteres (mínimo 1 letra maiúscula, 1 caractere especial e 1 número)'
//           )
//           .custom(async (value, { req }) => {
//               if (value !== req.body['c-senha']) {
//                   throw new Error('As senhas não são iguais!');
//               }
//               return true; // Adicione isso para garantir que a validação continue
//           }),
  
//       body('c-senha')
//           .isStrongPassword()
//           .withMessage(
//               'A senha deve ter no mínimo 8 caracteres (mínimo 1 letra maiúscula, 1 caractere especial e 1 número)'
//           )
//   ],
    regrasValidacaoFormRecSenha: [
      body("email")
        .isEmail()
        .withMessage("Digite um e-mail válido!")
        .custom(async (value) => {
          const email = await UsuarioModel.findUserEmail(value);  // Aqui você passa o valor diretamente
          if (!email || email.length === 0) {
            throw new Error("E-mail não encontrado");
          }
        }),
    ],

    recuperarSenha: async (req, res) => {
      const erros = validationResult(req);
      console.log(erros);
      if (!erros.isEmpty()) {
        return res.render("pages/esqueceusenha/rec-senha", {
          listaErros: erros,
          dadosNotificacao: null,
          valores: req.body,
        });
      }
    
      try {
        // Logica para recuperação de senha
        const user = await UsuarioModel.findUserEmail(req.body.email);  // Passar o e-mail diretamente
        if (!user || user.length === 0) {
          return res.status(404).json({ error: "Usuário não encontrado." });
        }
    
        const token = jwt.sign(
          { userId:  user[0].id_usuario  },  // Acessa corretamente o id_usuario
          process.env.SECRET_KEY,
          { expiresIn: "1h" }  // Expiração do token
        );
        console.log(token);

          //enviar e-mail com link usando o token
          const url = `${process.env.URL_BASE}/resetar-senha?token=${token}`;
          console.log(url)

        const  html = require("../util/email-reset-senha")( url, token)
          enviarEmail(req.body.email, "Pedido de recuperação de senha", null, html, ()=>{
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
        const token = req.query.token;
        console.log("Token recebido:", token);
        
        // validar token
        jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
            if (err) {
                res.render("pages/esqueceusenha/rec-senha", {
                    listaErros: null,
                    dadosNotificacao: {
                        titulo: "Link expirado!",
                        mensagem: "Insira seu e-mail para iniciar o reset de senha.",
                        tipo: "error",
                    },
                    valores: req.body
                });
            } else {
               // Aqui você deve garantir que decoded.userId está definido
        console.log("ID do usuário decodificado:", decoded.userId); // Debugging
                res.render("pages/esqueceusenha/resetar-senha", { // Corrigido o caminho da view
                    listaErros: null,
                    autenticado: req.session.autenticado,
                    id_usuario: decoded.userId, // Garantindo que id_usuario é passado para a view
                    dadosNotificacao: null
              });
            }
          });
        },
      
        resetarSenha: async (req, res) => {
          const erros = validationResult(req);
          console.log(erros);
          
          if (!erros.isEmpty()) {
            return res.render("pages/esqueceusenha/resetar-senha", {  
              listaErros: erros.array(),
              dadosNotificacao: null,
              valores: req.body,
            });
          }
        
          try {
            const { id_usuario, senha } = req.body;
            // Hash da nova senha
            const senhaHash = bcrypt.hashSync(senha, 10);
        

            console.log("Senha criptografada:", senhaHash);

            // Atualiza a senha no banco de dados
            const resultado = await UsuarioModel.atualizarSenhaUser(id_usuario, senhaHash);
            //   { senha_usuario: senhaHash },  // Certifique-se de usar a coluna correta do banco de dados
            //   req.body.id_usuario  // Certifique-se de que o ID está sendo passado corretamente
            
        

            if (resultado.affectedRows > 0) {
                res.redirect("/login"), {
                listaErros: null,
                      dados: null,
                      dadosNotificacao: {
                        titulo: "Perfil alterado",
                        mensagem: "Nova senha registrada com sucesso.",
                        tipo: "success",
                      },
                    }
            } else {
                res.status(400).send("Nenhum usuário encontrado.");
            }
            } catch (error) {
                console.log("Erro ao atualizar a senha:", error);
                res.status(500).send("Erro no servidor.");
            }        
            
        },
            // Redireciona para a página de login após a redefinição de senha
        //     return res.render("pages/login", {
        //       listaErros: null,
        //       dados: null,
        //       dadosNotificacao: {
        //         titulo: "Perfil alterado",
        //         mensagem: "Nova senha registrada com sucesso.",
        //         tipo: "success",
        //       },
        //     });
        //   } catch (error) {
        //     console.log(error);
        //     res.status(500).send("Erro ao redefinir a senha.");
        //   }
        // },
        
          regrasValidacaoPerfil: [
            body("nome"),
            // .isLength({ min: 3, max: 45 })
            // .withMessage("Nome de usuário deve conter pelo menos 3 letras"),
       
        body("user"),
            // .isLength({ min: 8, max: 45 })
            // .withMessage("Nome de usuário deve conter pelo menos 8 letras")
            // .bail(),
            // .custom(async (value) => {
            //     const user = await UsuarioModel.findUserByUsername(value);
            //     if (user.length > 0) {
            //         throw new Error('Nome de usuário já está em uso.');
            //     }
            //     return true;
            // }),
            // body("senha")
            // .isLength({ min: 8, max: 30 })
            // .withMessage("Senha inválida, deve conter pelo menos 8 caracteres")
            // .bail()
            // .matches(/^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])/)
            // .withMessage("Senha inválida, deve conter pelo menos 1 letra, 1 número e 1 caractere especial"),
     
            body('profileImage').optional().isString().withMessage('Imagem inválida'),
    
        ],
    
    
        mostrarPerfil: async (req, res) => {
            try {
                // Buscar usuário pelo ID da sessão
                let results = await UsuarioModel.findById(req.session.autenticado.id);
        
                if (results && results.length > 0) {
                    let campos = {
                        nome_usuario: results[0].nome_usuario, 
                        foto_usuario: results[0].foto_usuario != null ? `data:image/jpeg;base64,${results[0].foto_usuario.toString('base64')}` : "img/NovoPerfil/profile-2.png",
                        user_usuario: results[0].user_usuario, senha_usuario: "",
                        bio: results[0].bio
                    };
        
                    res.render("pages/Publicacao/Config/index", { listaErros: null, dadosNotificacao: null, valores: campos });
                    console.log(campos);
                } else {
                    let campos = {
                        nome_usuario: "", 
                        foto_usuario:  results[0].foto_usuario != null ? `data:image/jpeg;base64,${results[0].foto_usuario.toString('base64')}` : "img/NovoPerfil/profile-2.png",
                        user_usuario: results[0].user_usuario, 
                        senha_usuario: "",
                        bio:''
                    };
        
                    res.render("pages/Publicacao/Config/index", { listaErros: null, dadosNotificacao: null, valores: campos }); //colocar uma notificaçao
                }
            } catch (e) {
                console.log(e);
                res.render("pages/Publicacao/Config/index", {
                    listaErros: null, dadosNotificacao: null, valores: {
                        foto_usuario: "", nome_usuario: "", 
                        user_usuario: "", senha_usuario: ""
                    }
                });
            }
        },
        
    
        gravarPerfil: async (req, res) => {
    
            const erros = validationResult(req);
            const erroMulter = req.session.erroMulter;
            if (!erros.isEmpty() || erroMulter != null ) {
              console.log(erros)
              console.log(erroMulter)
                lista =  !erros.isEmpty() ? erros : {formatter:null, errors:[]};
                if(erroMulter != null ){
                    lista.errors.push(erroMulter);
                } 
                return res.render("pages/Publicacao/Config/index", { listaErros: lista, dadosNotificacao: null, valores: req.body })
            }
            try {
                var dadosForm = {
                    user_usuario: req.body.user,
                    nome_usuario: req.body.nome,
                    bio: req.body.bio
                };
                if (req.body.senha != "") {
                    dadosForm.senha_usuario = bcrypt.hashSync(req.body.senha, salt);
                }
                if (!req.file) {
                    console.log("Falha no carregamento");
                } else {
                    //Armazenando o caminho do arquivo salvo na pasta do projeto 
                    // caminhoArquivo = "imagem/perfil/" + req.file.filename;
                    // //Se houve alteração de imagem de perfil apaga a imagem anterior
                    // if(dadosForm.img_perfil_pasta != caminhoArquivo ){
                    //     removeImg(dadosForm.img_perfil_pasta);
                    // }
                    // dadosForm.img_perfil_pasta = caminhoArquivo;
                    // dadosForm.img_perfil_banco = null;
    
                    //Armazenando o buffer de dados binários do arquivo 
                    dadosForm.foto_usuario = req.file.buffer;                
                    //Apagando a imagem armazenada na pasta
                    // if(dadosForm.foto_usuario != null ){
                    //     removeImg(dadosForm.foto_usuario);
                    // }
          
                }
                console.log(req.session.autenticado)
                let resultUpdate = await UsuarioModel.update(dadosForm, req.session.autenticado.id);
                if (!resultUpdate.isEmpty) {
                    if (resultUpdate.changedRows == 1) {
                        var result = await UsuarioModel.findById(req.session.autenticado.id);
                        var autenticado = {
                            autenticado: result[0].nome_usuario,
                            id: result[0].id_usuario,
                            tipo: result[0].id_tipo_usuario,
                            foto: result[0].foto_usuario != null ? `data:image/jpeg;base64,${result[0].foto_usuario.toString('base64')}` : null,
                        };
                        req.session.autenticado = autenticado;
                        var campos = {
                            nome_usuario: result[0].nome_usuario, 
                            foto_usuario: result[0].foto_usuario != null ? `data:image/jpeg;base64,${result[0].foto_usuario.toString('base64')}` :null,
                            user_usuario: result[0].user_usuario, senha_usu: "",
                            bio: result[0].bio
                        }
                        res.render("pages/Publicacao/Config/index", { listaErros: null, dadosNotificacao: { titulo: "Perfil! atualizado com sucesso", mensagem: "Alterações Gravadas", tipo: "success" }, valores: campos });
                    }else{
                        res.render("pages/Publicacao/Config/index", { listaErros: null, dadosNotificacao: { titulo: "Perfil! atualizado com sucesso", mensagem: "Sem alterações", tipo: "success" }, valores: dadosForm });
                    }
                }
            } catch (e) {
                console.log(e)
                res.render("pages/Publicacao/Config/index", { listaErros: erros, dadosNotificacao: { titulo: "Erro ao atualizar o perfil!", mensagem: "Verifique os valores digitados!", tipo: "error" }, valores: req.body })
            }
        },
    

        buscarPerfilUsuario: async (req, res) => {
            try {
                const userId = req.session.autenticado.id; // Obtendo o ID do usuário logado
                const usuario = await UsuarioModel.buscarPerfilUsuario(userId); // Chamada ao model para buscar o perfil
                
                if (!usuario) {
                    return res.render("pages/Publicacao/Perfil/index", {
                        listaErros: [{ msg: "Usuário não encontrado." }],
                        dadosNotificacao: null
                    });
                }
        
                const fotoUsuario = usuario.foto_usuario ? usuario.foto_usuario.toString('base64') : null; // Convertendo a foto para Base64
        
                res.render("pages/Publicacao/Perfil/index", {
                    listaErros: null,
                    dados: usuario, // Aqui você pode passar o objeto de usuário
                    logado: req.session.autenticado,
                    nomeUsuario: usuario.nome_usuario || 'Nome não definido',
                    userUsuario: usuario.user_usuario || 'Usuário não definido',
                    fotoUsuario: fotoUsuario,
                    bio: usuario.bio || 'Bio não definida',
                    autenticado: req.session.autenticado,
                });
            } catch (error) {
                console.error(error);
                res.status(500).send("Erro ao buscar perfil do usuário.");
            }
        }
        



}
/* --------------------------login----------------------------------------- */

module.exports = UsuarioController;
