const pool = require("../../config/pool_conexoes");

const admModel = {
    buscarUsuarios: async () => {
        const query = `
            SELECT id_usuario, nome_usuario, email_usuario, tipo_usuario_id 
            FROM USUARIOS;
        `;
        const [rows] = await pool.query(query);
        return rows;
    },
    removerUsuario: async (id) => {
        const [result] = await pool.query('DELETE FROM USUARIOS WHERE id_usuario = ?', [id]);
        return result;
    },
    buscarPublicacoes: async () => {
        const query = `
            SELECT id_POSTS, comentarios_posts, img_posts, endereco_posts, USUARIOS_id_usuario1 
            FROM POSTS;
        `;
        const [rows] = await pool.query(query);
        return rows;
    },
    removerPublicacao: async (id) => {
        const [result] = await pool.query('DELETE FROM POSTS WHERE id_POSTS = ?', [id]);
        return result;
    }
};

module.exports = admModel;
