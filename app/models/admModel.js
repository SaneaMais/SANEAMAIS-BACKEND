var pool = require("../../config/pool_conexoes");

const admModel = {
    findAllUsers: async () => {
        try {
            const [result] = await pool.query('SELECT * FROM USUARIOS');
            return result; 
        } catch (error) {
            throw new Error(`Erro ao buscar todos os usuários: ${error.message}`);
        }
    },
    // Paginador 
    findPage: async (inicio, total) => { // Alterado o nome do parâmetro para 'inicio' para maior clareza
        try {
            const [linhas] = await pool.query('SELECT * FROM USUARIOS ORDER BY id_usuario DESC LIMIT ?, ?', [inicio, total]);
            return linhas;
        } catch (error) {
            throw new Error(`Erro ao buscar usuários na página: ${error.message}`);
        }
    },

    totalReg: async () => {
        try {
            const [linhas] = await pool.query('SELECT count(*) as total FROM USUARIOS');
            return linhas[0].total; // Retornar apenas o total diretamente
        } catch (error) {
            throw new Error(`Erro ao contar registros: ${error.message}`);
        }
    },
    // Excluindo usuário da tabela 
    findByTypeDelete: async (id) => {
        try {
            await pool.query('DELETE FROM USUARIOS WHERE id_usuario = ?', [id]);
        } catch (error) {
            throw new Error('Erro ao excluir usuário: ' + error.message);
        }
    },
};

module.exports = admModel;
