const InstituicaoModel = require('../models/InstituModel');

class InstituicaoController {
    static async cadastrar(req, res) {
        console.log('req.body:', req.body);  
        console.log('req.session:', req.session);
        const { razao_social_instituicao, cnpj_instituicao } = req.body;

        
        const usuarioId = req.session.userId;

        try {

            
            await InstituicaoModel.cadastrarInstituicao(razao_social_instituicao, cnpj_instituicao, usuarioId);
            res.redirect('/publicacao');
        } catch (error) {
            console.error(error.message);
            res.status(500).send('Erro no servidor ao cadastrar a instituição.');
        }
    }
}

module.exports = InstituicaoController;
