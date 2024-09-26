const pool = require("../../config/pool_conexoes");

const publiModel = {
    create: async(data) => {
        const query = `
            INSERT INTO POSTS (comentarios_posts, img_posts, USUARIOS_id_usuario1) 
            VALUES (?, ?, ?)`;
            try {
                const [results] = await pool.query(query, [data.comentarios_posts, data.img_posts, data.USUARIOS_id_usuario1]);
                return results.insertId;
            } catch (err) {
                throw err; 
            }
        },

    findAll: async() => {
        const query = 'SELECT * FROM POSTS ORDER BY id_POSTS DESC';
        
        try {
            const [results] = await pool.query(query);
            return results;
        } catch (err) {
            throw err; 
        }
    }
};


module.exports = publiModel;
