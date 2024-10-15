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

    findAll: async (postId) => {  
        const query = `
            SELECT
                c.COMENTARIO,
                u.user_usuario,
                c.data
            FROM COMENTARIOS c
            INNER JOIN USUARIOS u ON c.USUARIOS_id_usuario = u.id_usuario
            WHERE c.POSTS_id_POSTS = ?
            ORDER BY c.data DESC
        `;
        
        try {
            const [results] = await pool.query(query, [postId]);  
            // Incluindo todas as informações necessárias
            return results.map(row => ({
                comentario: row.COMENTARIO,
                user_usuario: row.user_usuario, 
                data: row.data                    
            }));
        } catch (err) {
            throw err;
        }
    }
}    

module.exports = ComentarioModel;
