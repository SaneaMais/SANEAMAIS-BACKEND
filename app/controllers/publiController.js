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

    const { comentarios_posts, endereco_posts } = req.body;
    const USUARIOS_id_usuario1 = req.session?.autenticado?.id;
    if (!USUARIOS_id_usuario1) {
        console.error('Usuário não autenticado');
        return res.status(401).send('Usuário não autenticado');
    }

    const img_posts = req.file ? req.file.buffer : null;

    console.log('Dados recebidos para criar publicação:', {
        comentarios_posts,
        endereco_posts,
        USUARIOS_id_usuario1,
        img_posts,
    });

    try {
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

// Função para buscar todas as publicações
exports.buscarPublicacoes = async (req, res) => {
    const dadosNotificacao = req.session.dadosNotificacao || null;
    delete req.session.dadosNotificacao;

    try {
        const publicacoes = await publiModel.findAll();
        console.log('Publicações encontradas:', publicacoes);

        for (let publicacao of publicacoes) {
            const comentarios = await ComentarioModel.findAll(publicacao.id_POSTS);
            publicacao.comentarios = comentarios;
        }

        res.render('pages/publicacao/publi/index', {
            listaErros: null,
            dadosNotificacao: dadosNotificacao,
            dados: publicacoes,
            pagina: 'publicacao',
            logado: req.session.autenticado,
            autenticado: req.session.autenticado,
        });
    } catch (error) {
        console.error('Erro ao buscar publicações:', error);
        return res.status(500).send('Erro ao buscar publicações');
    }
};

// Função para buscar as publicações de um usuário específico
exports.buscarPublicacoesUsuario = async (req, res) => {
    const idUsuario = req.session?.autenticado?.id;
    if (!idUsuario) {
        console.error('Usuário não autenticado');
        return res.status(401).send('Usuário não autenticado');
    }

    try {
        // Buscar publicações do usuário
        const publicacoes = await publiModel.findByUserId(idUsuario);

        // Carregar comentários para cada publicação
        for (let publicacao of publicacoes) {
            const comentarios = await ComentarioModel.findAll(publicacao.id_POSTS);
            publicacao.comentarios = comentarios;

            // Adicione a foto do usuário da publicação
            publicacao.foto_usuario = publicacao.foto_usuario ? publicacao.foto_usuario.toString('base64') : null;
        }

        // Verificar se há publicações e pegar os dados do usuário
        const usuario = publicacoes.length > 0 ? publicacoes[0] : null;

        res.render("pages/Publicacao/Perfil/index", {
            listaErros: null,
            dados: publicacoes,
            logado: req.session.autenticado,
            nomeUsuario: usuario ? usuario.nome_usuario : 'Nome não definido',
            userUsuario: usuario ? usuario.user_usuario : 'Usuário não definido',
            fotoUsuario: usuario && usuario.foto_usuario ? usuario.foto_usuario : null,
            bio: usuario ? usuario.bio || 'Bio não definida' : 'Bio não definida', 
            autenticado: req.session.autenticado,
        });
    } catch (error) {
        console.error('Erro ao buscar publicações do usuário:', error);
        return res.status(500).send('Erro ao buscar publicações');
    }
};

