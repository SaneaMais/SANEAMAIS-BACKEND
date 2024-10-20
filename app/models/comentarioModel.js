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
    },

    findComentariosByUserId: async (userId) => {
    const query = `
        SELECT 
            c.id_COMENTARIOS,
            c.COMENTARIO,
            c.data,
            u.nome_usuario,
            u.user_usuario,
            u.foto_usuario
        FROM COMENTARIOS c
        INNER JOIN USUARIOS u ON c.USUARIOS_id_usuario = u.id_usuario
        WHERE u.id_usuario = ?
        ORDER BY c.data DESC`;

    try {
        const [results] = await pool.query(query, [userId]);
        
        // Log para verificar os resultados retornados
        console.log('Resultados da consulta de comentários:', results);

        // Transformando os resultados em um formato mais amigável
        return results.map(row => ({
            id: row.id_COMENTARIOS,
            comentario: row.COMENTARIO,
            data: row.data,
            nome_usuario: row.nome_usuario,
            user_usuario: row.user_usuario,
            foto_usuario: row.foto_usuario
        }));
    } catch (err) {
        console.error('Erro ao buscar comentários do usuário:', err);
        throw err;
    }
}
}
    

module.exports = ComentarioModel;
