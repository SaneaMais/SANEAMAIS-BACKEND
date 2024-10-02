const pool = require("../../config/pool_conexoes");

const publiModel = {
    create: async (data) => {
        const query = `
            INSERT INTO POSTS (comentarios_posts, img_posts, USUARIOS_id_usuario1, endereco_posts) 
            VALUES (?, ?, ?, ?)`;
        try {
            const [results] = await pool.query(query, [data.comentarios_posts, data.img_posts, data.USUARIOS_id_usuario1, data.endereco_posts]);
            return results.insertId;
        } catch (err) {
            throw err;
        }
    },

    findAll: async () => {
        const query = `
            SELECT 
                POSTS.id_POSTS,
                POSTS.comentarios_posts,
                POSTS.img_posts,
                POSTS.endereco_posts,
                USUARIOS.nome_usuario,
                USUARIOS.user_usuario,
                USUARIOS.foto_usuario
            FROM POSTS
            INNER JOIN USUARIOS ON POSTS.USUARIOS_id_usuario1 = USUARIOS.id_usuario
            ORDER BY POSTS.id_POSTS DESC`;

        try {
            const [results] = await pool.query(query);
            return results;
        } catch (err) {
            throw err;
        }
    }
};

module.exports = publiModel;
