const pool = require("../../config/pool_conexoes");

const UsuarioModel = {
    create: async (data) => {
        try {
           // if (!data.nasc) {
              //  throw new Error('Data de nascimento não pode ser nula.');
          //  }

            const [resultados] =   await pool.query(
                'INSERT INTO USUARIOS (`nome_usuario`, `email_usuario`, `user_usuario`, `data_nasc_usuario`, `cidade_usuario`, `senha_usuario`, `tipo_usuario_id` ) VALUES (?, ?, ?, ?, ?, ?, ?)',
                [data.nome, data.email, data.user, data.nasc, data.cidade, data.senha, data.tipo_usuario_id]
            );
            return resultados;
        } catch (error) {
            console.log(error);
            throw error;
        }
    },

    findUserEmail: async (email) => {
        try {
            const [linhas] = await pool.query('SELECT * FROM USUARIOS WHERE email_usuario = ? ', [email]);
            return linhas;
        } catch (error) {
            console.log(error);
            throw error;z
        }
    },

    
    findUserByUsername: async (username) => {
        try {
            const [linhas] = await pool.query('SELECT * FROM USUARIOS WHERE user_usuario = ?', [username]);
            return linhas;
        } catch (error) {
            console.error(error);
            throw error;
        }
    },
};

module.exports = UsuarioModel;
