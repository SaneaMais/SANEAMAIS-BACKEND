var pool = require("../../config/pool_conexoes");

    const UsuarioModel = {
        create:async (usuario) => {
            try {
                const [result] = await pool.query(
                    'INSERT INTO USUARIOS (`nome_usuario`, `id_usuario`, `user_usuario`, `data_nasc_usuario`, `senha_usuario`,`email_usuario`, `cep_usuario`, `uf_usuario`, `bairro_usuario`, `logradouro_usuario`, `cidade_usuario`, `foto_usuario`) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?)',
                    [usuario.nome, usuario.id, usuario.user, usuario.data_nasc, usuario.email, usuario.cep. usuario.uf, usuario.logradouro, usuario.bairro, usuario.cidade, usuario.foto, /*bcrypt.hashSync(*/usuario.senha/*, salt) */, usuario.type]
                );
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