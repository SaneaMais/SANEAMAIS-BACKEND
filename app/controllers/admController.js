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
        const usuarioId = parseInt(req.params.id);
        if (isNaN(usuarioId)) {
            return res.status(400).json({ message: 'ID inválido' });
        }
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
            const publicacoesComImagem = publicacoes.map(pub => {

                if (pub.img_posts) {
                    pub.img_posts = `data:image;base64,${pub.img_posts.toString('base64')}`;
                }
                return pub;
            });

            const dadosNotificacao = req.session.dadosNotificacao || null;
            delete req.session.dadosNotificacao;

            res.render('pages/adm/publiadm', {
                publicacoes: publicacoesComImagem,
                dadosNotificacao,
                autenticado: req.session.autenticado
            });
        } catch (error) {
            console.error('Erro ao buscar publicações:', error);
            res.status(500).send('Erro ao carregar publicações.');
        }
    },


    removerPublicacao: async (req, res) => {
        const postId = parseInt(req.params.id, 10);
        if (isNaN(postId)) {
            return res.status(400).json({ message: 'ID inválido' });
        }
        try {
            await admModel.removerPublicacao(postId);
            res.status(200).json({ message: 'Publicação removida com sucesso.' });
        } catch (error) {
            console.error('Erro ao remover publicação:', error);
            res.status(500).json({ message: 'Erro ao remover publicação.' });
        }
    },
    


    listarComentarios: async (req, res) => {
        try {
            const comentarios = await admModel.buscarComentarios();
            const dadosNotificacao = req.session.dadosNotificacao || null;
            delete req.session.dadosNotificacao;

            res.render('pages/adm/comentarios', {
                comentarios,
                dadosNotificacao,
                autenticado: req.session.autenticado
            });
        } catch (error) {
            console.error('Erro ao buscar comentários:', error);
            res.status(500).send('Erro ao carregar comentários.');
        }
    },


    removerComentario: async (req, res) => {
        const comentarioId = req.params.id;
        try {
            await admModel.removerComentario(comentarioId);
            res.status(200).json({ message: 'Comentário removido com sucesso.' });
        } catch (error) {
            console.error('Erro ao remover comentário:', error);
            res.status(500).json({ message: 'Erro ao remover comentário.' });
        }
    },


};

module.exports = admController;
