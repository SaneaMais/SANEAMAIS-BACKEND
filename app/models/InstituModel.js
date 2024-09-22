const pool = require("../../config/pool_conexoes");


class InstituicaoModel {
    static async cadastrarInstituicao(razaoSocial, cnpj, usuarioId) {
        const query = `INSERT INTO INSTITUICOES (razao_social_instituicao, cnpj_instituicao, USUARIOS_id_usuario) VALUES (?, ?, ?)`;
        try {
            const connection = await pool.getConnection();
            await connection.query(query, [razaoSocial, cnpj, usuarioId]);
            connection.release();
        } catch (error) {
            throw new Error('Erro ao cadastrar instituição: ' + error);
        }
    }
}

module.exports = InstituicaoModel;
