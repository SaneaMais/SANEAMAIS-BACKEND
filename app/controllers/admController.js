const admModel = require("../models/admModel");

const admController = {
    listarUsuarios: async (req, res) => {
        try {
            const usuarios = await admModel.buscarUsuarios();
            const publicacoes = await admModel.buscarPublicacoes(); // Buscar publicações
            const dadosNotificacao = req.session.dadosNotificacao || null;
            delete req.session.dadosNotificacao;

            res.render('pages/adm/adm', {
                usuarios,
                publicacoes, // Passar publicações para o EJS
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
    },

    listarPublicacoes: async (req, res) => {
        try {
            const publicacoes = await admModel.buscarPublicacoes();
            const dadosNotificacao = req.session.dadosNotificacao || null;
            delete req.session.dadosNotificacao;
    
            res.render('pages/adm/publiadm', {
                publicacoes,
                dadosNotificacao,
                autenticado: req.session.autenticado
            });
        } catch (error) {
            console.error('Erro ao buscar publicações:', error);
            res.status(500).send('Erro ao carregar publicações.');
        }
    },
    

    removerPublicacao: async (req, res) => {
        const publicacaoId = req.params.id; 
        try {
            await admModel.removerPublicacao(publicacaoId); 
            res.status(200).json({ message: 'Publicação removida com sucesso.' });
        } catch (error) {
            console.error('Erro ao remover publicação:', error);
            res.status(500).json({ message: 'Erro ao remover publicação.' });
        }
    }
};

module.exports = admController;
