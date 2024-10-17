const pool = require("../../config/pool_conexoes");

const RankingModel = {
    // Método para buscar o ranking de cidades com base na quantidade de usuários registrados
    getRanking: async () => {
        try {
            const query = `
                SELECT cidade_usuario AS nome, COUNT(*) AS denuncias
                FROM USUARIOS
                GROUP BY cidade_usuario
                ORDER BY denuncias DESC
                LIMIT 10;
            `;
            const [resultados] = await pool.query(query);
            return resultados;
        } catch (error) {
            console.error('Erro ao buscar ranking no banco de dados:', error);
            throw error;
        }
    },
};

module.exports = RankingModel;
