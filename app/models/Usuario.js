var pool = require("../../config/pool_conexoes");

    const usuarioModel = {
        findAll: async () => {
            try {
                const [resultados] = await pool.query(
                    "SELECT * FROM bzudsbddxmqodnzmzk08.USUARIOS;"
                )
                return resultados;
            } catch (error) {
                console.log(error);
                return error;  
            }
        },

        findUserEmail: async (camposForm) => {
            try {
                const [resultados] = await pool.query(
                    "SELECT * FROM USUARIOS; WHERE user_usuario = ? or email_usuario = ?",
                    [camposForm.user_usuario, camposForm.user_usuario]
                )
                return resultados;
            } catch (error) {
                console.log(error);
                return error;
            }
        },

        findCampoCustom: async (criterioWhere) => {
            try {
                const [resultados] = await pool.query(
                    "SELECT count(*) totalReg FROM usuario WHERE ?",
                    [criterioWhere]
                )
                return resultados[0].totalReg;
            } catch (error) {
                console.log(error);
                return error;
            }
        },

        findId: async (id) => {
            try {
                const [resultados] = await pool.query(
                    "SELECT id_usuario, nome_usuario, user_usuario, data_nasc_usuario, senha_usuario," +
                     "email_usuario, telefone_usuario, cep_usuario, uf_usuario," +
                "bairro_usuario, logradouro_usuario, cidade_usuario, foto_usuario = ?",   [id]
                )
                return resultados;
            } catch (error) {
                console.log(error);
                return error;
            }
        },


        create: async (camposForm) => {
            try {
                const [resultados] = await pool.query(
                    "insert into usuario set ?", [camposForm]
                )
                return resultados;
            } catch (error) {
                console.log(error);
                return null;
            }
        },

        update: async (camposForm, id) => {
            try {
                const [resultados] = await pool.query(
                    "UPDATE usuario SET ? " +
                    " WHERE id_usuario = ?",
                    [camposForm, id]
                )
                return resultados;
            } catch (error) {
                console.log(error);
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

    module.exports = usuarioModel