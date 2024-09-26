const pool = require("../../config/pool_conexoes");

const publiModel = {
    findAll: async () => {
        try {
            const [rows] = await pool.query('SELECT * FROM POSTS');
            return rows;
        } catch (error) {
            console.error('Erro ao buscar publicações:', error);
            throw error;
        }
    },
    create: async (publi) => {
        const sql = 'INSERT INTO POSTS (comentarios_posts, img_posts, USUARIOS_id_usuario1) VALUES (?, ?, ?)';
        const params = [
            publi.comentarios_posts,
            publi.img_posts,
            publi.USUARIOS_id_usuario1,
        ];
        try {
            await pool.query(sql, params);
            console.log('Publicação criada com sucesso!');
        } catch (error) {
            console.error('Erro ao criar publicação:', error);
            throw error;
        }
    }
};

module.exports = publiModel;
