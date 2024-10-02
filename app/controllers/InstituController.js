const InstituicaoModel = require('../models/InstituModel');
const UsuarioModel = require('../models/UsuarioModel');

class InstituicaoController {
    static async cadastrar(req, res) {
        console.log('req.body:');
        console.log(req.body);
        console.log('req.session:');
        console.log(req.session);

        const { razao_social_instituicao, cnpj_instituicao, cidade, email, user, senha } = req.body;

        if (!razao_social_instituicao || !cnpj_instituicao || !cidade || !email || !user || !senha) {
            return res.status(400).send('Campos obrigatórios faltando.');
        }

        try {
            // Dados do usuário para serem usados no cadastro
            let dadosFormularioUsuario = {
                nome: null, 
                email: email,
                user: user,
                cidade: cidade,
                nasc: null,  
                senha: senha,
                tipo_usuario_id: 2  
            };

            // Inserir usuário primeiro
            const insertUsuario = await UsuarioModel.create(dadosFormularioUsuario);
            const usuarioId = insertUsuario.insertId;

            // Inserir instituição
            await InstituicaoModel.cadastrarInstituicao(razao_social_instituicao, cnpj_instituicao, usuarioId);

            res.redirect("/publicacao");
        } catch (error) {
            console.error('Erro ao cadastrar instituição:', error.message);
            res.status(500).send('Erro no servidor ao cadastrar a instituição.');
        }
    }
}

module.exports = InstituicaoController;
