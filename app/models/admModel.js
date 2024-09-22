const pool = require("../../config/pool_conexoes");

const admModel = {
    buscarUsuarios: async () => {
        const query = `
            SELECT nome_usuario, email_usuario, tipo_usuario_id 
            FROM USUARIOS;
        `;
        const [rows] = await pool.query(query);
        return rows;
    },
    removerUsuario: async (id) => {
        const [result] = await pool.query('DELETE FROM USUARIOS WHERE id_usuario = ?', [id]);
        return result;
    }
};

module.exports = admModel;
