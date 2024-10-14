const pool = require("../../config/pool_conexoes");

const ComentarioModel = {
    create: async (data) => {
        const query = `
            INSERT INTO COMENTARIOS (COMENTARIO, USUARIOS_id_usuario, POSTS_id_POSTS, data)
            VALUES (?, ?, ?, NOW())`;

        try {
            // Log para verificar os dados antes da query
            console.log('Dados para inserção:', data);
            const [results] = await pool.query(query, [data.comentario, data.usuarioId, data.postId]);
            return results.insertId;
        } catch (err) {
            throw err;
        }
    },

    // Método para buscar comentários de um post específico
    findAll: async (postId) => {  // Recebe postId como argumento
        const query = `
            SELECT * FROM COMENTARIOS
            WHERE POSTS_id_POSTS = ?
            ORDER BY data DESC
        `;
        try {
            const [results] = await pool.query(query, [postId]);  // Passa o postId para a query
            return results;
        } catch (err) {
            throw err;
        }
    }
};

module.exports = ComentarioModel;
