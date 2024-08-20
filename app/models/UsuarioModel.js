const pool = require("../../config/pool_conexoes");

const UsuarioModel = {
    create: async (data) => {
        try {
            if (!data.nasc) {
                throw new Error('Data de nascimento não pode ser nula.');
            }

            await pool.query(
                'INSERT INTO USUARIOS (`nome_usuario`, `email_usuario`, `user_usuario`, `data_nasc_usuario`, `cidade_usuario`, `senha_usuario` ) VALUES (?, ?, ?, ?, ?, ?)',
                [data.nome, data.email, data.user, data.nasc, data.cidade, data.senha]
            );
        } catch (error) {
            console.log(error);
            throw error;
        }
    },

    findUserByUsername: async (username) => {
        try {
            const [rows] = await pool.query('SELECT * FROM USUARIOS WHERE user_usuario = ?', [username]);
            return rows;
        } catch (error) {
            console.error(error);
            throw error;
        }
    },

    findUserEmail: async (email) => {
        try {
            const [rows] = await pool.query(
                `SELECT * FROM USUARIOS WHERE email_usuario = ?  `, [email]
            );
            return rows;
        } catch (error) {
            console.error(error);
            throw error;
        }
    },
};

module.exports = UsuarioModel;
