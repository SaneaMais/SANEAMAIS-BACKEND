const pool = require("../../config/pool_conexoes");

const InstituicaoModel = {
    cadastrarInstituicao: async (razao_social_instituicao, cnpj_instituicao, usuarioId) => {
        try {
            const [resultados] = await pool.query(
                'INSERT INTO INSTITUICOES (`razao_social_instituicao`, `cnpj_instituicao`, `USUARIOS_id_usuario`) VALUES (?, ?, ?)',
                [razao_social_instituicao, cnpj_instituicao, usuarioId]
            );
            return resultados;
        } catch (error) {
            console.log(error);
            throw error;
        }
    },

    
    findByCNPJ: async (cnpj_instituicao) => {
        try {
            const [resultados] = await pool.query(
                'SELECT * FROM INSTITUICOES WHERE cnpj_instituicao = ?',
                [cnpj_instituicao]
            );
            return resultados;
        } catch (error) {
            console.log(error);
            throw error;
        }
    },
    
};

module.exports = InstituicaoModel;
