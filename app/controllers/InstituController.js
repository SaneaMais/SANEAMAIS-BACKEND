const InstituicaoModel = require('../models/InstituModel');

class InstituicaoController {
    static async cadastrar(req, res) {
        const { razao_social_instituicao, cnpj_instituicao } = req.body;

        // Assumindo que o usuário esteja autenticado e que o ID do usuário esteja salvo na sessão
        const usuarioId = req.session.userId;

        try {
            await InstituicaoModel.cadastrarInstituicao(razao_social_instituicao, cnpj_instituicao, usuarioId);
            res.redirect('/alguma-rota-de-sucesso');
        } catch (error) {
            console.error(error.message);
            res.status(500).send('Erro no servidor ao cadastrar a instituição.');
        }
    }
}

module.exports = InstituicaoController;
