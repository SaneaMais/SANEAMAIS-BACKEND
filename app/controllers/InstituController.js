const InstituicaoModel = require('../models/InstituModel');
const UsuarioModel = require('../models/UsuarioModel');

class InstituicaoController {
    static async cadastrar(req, res) {
        console.log('req.body:');  
        console.log(req.body);  
        console.log('req.session:');
        console.log(req.session);

        const { razao_social_instituicao, cnpj_instituicao } = req.body;

        
        const usuarioId = req.session.userId;

      


        try {
        //insert no usuario
            let dadosFormulario = {
                nome: null,
                email: req.body.email,
                user: req.body.user,
                cidade: req.body.cidade,
                senha: req.body.senha,

            }
        let insert = UsuarioModel.create();    
        // recuperar o id criado
        console.log(insert);
            let usuarioId = insert.insertId;

        //insert n instituicao
        await InstituicaoModel.cadastrarInstituicao(razao_social_instituicao, cnpj_instituicao, usuarioId);
            
            res.redirect('/publicacao');
        } catch (error) {
            console.error(error.message);
            res.status(500).send('Erro no servidor ao cadastrar a instituição.');
        }
    }
}

module.exports = InstituicaoController;
