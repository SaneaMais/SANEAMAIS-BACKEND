var pool = require("../../config/pool_conexoes");

    const UsuarioModel = {
        create:async (usuario) => {
            try {
                const [result] = await pool.query(
                    'INSERT INTO USUARIOS ( `id_usuario`,`nome_usuario`, `data_nasc_usuario`,`foto_usuario`,`cidade_usuario`,`logradouro_usuario`, `bairro_usuario`, `uf_usuario`,`cep_usuario`,`email_usuario`,`senha_usuario`,`user_usuario`, `telefone_usuario`) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?)',
                    [usuario.id, usuario.nome, usuario.data_nasc, usuario.foto, usuario.cidade, usuario.logradouro, usuario.bairro, usuario.uf, usuario.cep, usuario.email, usuario.senha, usuario.user, usuario.telefone]
                );
                console.log("Dados para inserção:", usuario);
                return result;
            } catch (error) {
                throw error;  
            }
        },

        findUserEmail: async (usuario, id) => {
            try {
                const [linhas] = await pool.query(
                    `SELECT * FROM USUARIOS; WHERE email_usuario = ? ${id?'AND id_usuario !=?': ''}` , [usuario, id]
                   
                )
                return linhas;
            } catch (error) {
                return error;
            }
        },

        findUserNome: async (usuario, id) => {
            try {
                const [linhas] = await pool.query(
                    `SELECT * FROM USUARIOS; WHERE nome_usuario = ? ${id?'AND id_usuario !=?': ''}` , [usuario, id]
                   
                )
                return linhas;
            } catch (error) {
                return error;
            }
        },

        findUserUsuario: async (usuario, id) => {
            try {
                const [linhas] = await pool.query(
                    `SELECT * FROM USUARIOS; WHERE user_usuario = ? ${id?'AND id_usuario !=?': ''}` , [usuario, id]
                   
                )
                return linhas;
            } catch (error) {
                return error;
            }
        },

        findUserDataNasc: async (usuario, id) => {
            try {
                const [linhas] = await pool.query(
                    `SELECT * FROM USUARIOS; WHERE data_nasc_usuario = ? ${id?'AND id_usuario !=?': ''}` , [usuario, id]
                   
                )
                return linhas;
            } catch (error) {
                return error;
            }
        },

        findUserCEP: async (usuario, id) => {
            try {
                const [linhas] = await pool.query(
                    `SELECT * FROM USUARIOS; WHERE cep_usuario = ? ${id?'AND id_usuario !=?': ''}` , [usuario, id]
                   
                )
                return linhas;
            } catch (error) {
                return error;
            }
        },
        findUserEmail: async (usuario, id) => {
            try {
                const [linhas] = await pool.query(
                    `SELECT * FROM USUARIOS; WHERE email_usuario = ? ${id?'AND user_usuario !=?': ''}` , [usuario, id]
                   
                )
                return linhas;
            } catch (error) {
                return error;
            }
        },


        update: async (usuario, id) => {
            try {
                const [linhas] = await pool.query(`UPDATE usuario SET ? WHERE id_usuario = ?` , [usuario, id]
                )
                return linhas;
            } catch (error) {
                return error;
            }
        },

        delete: async (id) => {
            try {
                const [resultados] = await pool.query(
                    "UPDATE usuario SET status_usuario = 0 WHERE id_usuario = ? ", [id]
                )
                return resultados;
            } catch (error) {
                console.log(error);
                return error;
            }
        },
    };

    module.exports = UsuarioModel;