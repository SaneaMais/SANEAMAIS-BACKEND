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
            console.log(err);
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
    },

    // Novo método para buscar publicações por ID de usuário
    findByUserId: async (userId) => {
        const query = `
            SELECT 
                POSTS.id_POSTS,
                POSTS.comentarios_posts,
                POSTS.img_posts,
                POSTS.endereco_posts,
                USUARIOS.nome_usuario,
                USUARIOS.user_usuario,
                USUARIOS.foto_usuario,
                USUARIOS.bio
            FROM POSTS
            INNER JOIN USUARIOS ON POSTS.USUARIOS_id_usuario1 = USUARIOS.id_usuario
            WHERE POSTS.USUARIOS_id_usuario1 = ?
            ORDER BY POSTS.id_POSTS DESC`;

        try {
            const [results] = await pool.query(query, [userId]);
            return results;
        } catch (err) {
            console.error('Erro ao buscar publicações do usuário:', err);
            throw err;
        }
    }
};

module.exports = publiModel;
