const { body, validationResult } = require("express-validator");
const publiModel = require("../models/publiModel");
const ComentarioModel = require("../models/comentarioModel");

// Função para criar uma nova publicação
exports.criarPublicacao = async (req, res) => {
    console.log('req:', req);
    console.log('res:', res);
    if (!req || !res) {
        console.error('Requisição ou resposta indefinida');
        return res.status(500).send('Erro no servidor');
    }

    // Capturando os dados do body, incluindo o endereço
    const { comentarios_posts, endereco_posts } = req.body;
    const USUARIOS_id_usuario1 = req.session?.autenticado?.id;
    if (!USUARIOS_id_usuario1) {
        console.error('Usuário não autenticado');
        return res.status(401).send('Usuário não autenticado');
    }

    // Verificando se a imagem foi recebida
    const img_posts = req.file ? req.file.buffer : null; // Armazena a imagem como BLOB

    console.log('Dados recebidos para criar publicação:', {
        comentarios_posts,
        endereco_posts,
        USUARIOS_id_usuario1,
        img_posts,
    });

    try {
        // Passando também o endereço para o modelo
        await publiModel.create({
            comentarios_posts,
            img_posts,
            USUARIOS_id_usuario1,
            endereco_posts
        });
        req.session.dadosNotificacao = {
            titulo: "Sucesso!",
            mensagem: "Publicação criada com sucesso.",
            tipo: "success"
        };
        return res.redirect("/Publicacao");
    } catch (error) {
        console.error('Erro ao criar publicação 1:', error);
        return res.status(500).send('Erro ao criar publicação 2');
    }
};



exports.buscarPublicacoes = async (req, res) => {
    const dadosNotificacao = req.session.dadosNotificacao || null;
    delete req.session.dadosNotificacao;

    try {
        // Buscar todas as publicações
        const publicacoes = await publiModel.findAll();
        console.log('Publicações encontradas:', publicacoes);

        // Para cada publicação, buscar os comentários relacionados
        for (let publicacao of publicacoes) {
            const comentarios = await ComentarioModel.findAll(publicacao.id_POSTS);
            publicacao.comentarios = comentarios; // Adicionar os comentários à publicação
        }

        // Renderizar a página com as publicações e os comentários
        res.render('pages/publicacao/publi/index', {
            listaErros: null,
            dadosNotificacao: dadosNotificacao,
            dados: publicacoes, // Passa as publicações para a renderização
            pagina: 'publicacao',
            logado: req.session.autenticado,
            autenticado: req.session.autenticado,
        });
    } catch (error) {
        console.error('Erro ao buscar publicações:', error);
        return res.status(500).send('Erro ao buscar publicações');
    }
};
