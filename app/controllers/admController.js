const admModel = require("../models/admModel");

const admController = {
    listarUsuarios: async (req, res) => {
        try {
            const usuarios = await admModel.buscarUsuarios();
            const dadosNotificacao = req.session.dadosNotificacao || null;
            delete req.session.dadosNotificacao;

            res.render('pages/adm/adm', {
                usuarios, 
                dadosNotificacao, 
                logado: null, 
                autenticado: req.session.autenticado
            });
        } catch (error) {
            console.error('Erro ao buscar usuários:', error);
            res.status(500).send('Erro ao carregar usuários.');
        }
    },
    removerUsuario: async (req, res) => {
        const usuarioId = req.params.id; // Obtenha o ID do usuário a ser removido
        try {
            await admModel.removerUsuario(usuarioId); 
            res.status(200).json({ message: 'Usuário removido com sucesso.' });
        } catch (error) {
            console.error('Erro ao remover usuário:', error);
            res.status(500).json({ message: 'Erro ao remover usuário.' });
        }
    }
};

module.exports = admController;
