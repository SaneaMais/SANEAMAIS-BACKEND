const RankingModel = require("../models/RankingModel");

const RankingController = {
    getRanking: async (req, res) => {
        try {
            const cidadesRanking = await RankingModel.getRanking();

            if (cidadesRanking.length === 0) {
                return res.status(404).json({ message: 'Nenhuma cidade encontrada.' });
            }

            res.status(200).json(cidadesRanking);
        } catch (error) {
            console.error('Erro ao buscar ranking:', error);
            res.status(500).json({ error: 'Erro ao buscar ranking' });
        }
    },
};

module.exports = RankingController;

