const pool = require("../../config/pool_conexoes");

const admModel = {
    buscarUsuarios: async () => {
        const query = `
            SELECT id_usuario, nome_usuario, email_usuario, tipo_usuario_id 
            FROM USUARIOS where id_usuario != 1
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
            SELECT p.id_POSTS, p.comentarios_posts, p.img_posts, p.endereco_posts, u.nome_usuario 
            FROM POSTS p
            JOIN USUARIOS u ON p.USUARIOS_id_usuario1 = u.id_usuario;
        `;
        const [rows] = await pool.query(query);
        return rows;
    },
    
    
    removerComentariosDaPublicacao: async (postId) => {
        const [result] = await pool.query('DELETE FROM COMENTARIOS WHERE POSTS_id_POSTS = ?', [postId]);
        return result;
    },

    removerPublicacao: async (id) => {
        await admModel.removerComentariosDaPublicacao(id);

        const [result] = await pool.query('DELETE FROM POSTS WHERE id_POSTS = ?', [id]);
        return result;
    },
    

    buscarComentarios: async () => {
        const query = `
            SELECT c.id_COMENTARIOS, c.COMENTARIO, c.data, p.id_POSTS, u.nome_usuario 
            FROM COMENTARIOS c
            JOIN POSTS p ON c.POSTS_id_POSTS = p.id_POSTS
            JOIN USUARIOS u ON c.USUARIOS_id_usuario = u.id_usuario;
        `;
        const [rows] = await pool.query(query);
        return rows;
    },    

    removerComentario: async (id) => {
        const [result] = await pool.query('DELETE FROM COMENTARIOS WHERE id_COMENTARIOS = ?', [id]);
        return result;
    },
    
    
};

module.exports = admModel;
