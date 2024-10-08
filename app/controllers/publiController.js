const { body, validationResult } = require("express-validator");
const publiModel = require("../models/publiModel");

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
    const USUARIOS_id_usuario1 =  req.session?.autenticado?.id;
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
                endereco_posts });
        return res.redirect("/Publicacao"); 
    } catch (error) {
        console.error('Erro ao criar publicação:', error);
        return res.status(500).send('Erro ao criar publicação');
    }
};

// Função para buscar todas as publicações e exibir no feed
exports.buscarPublicacoes = async (req) => {
    try {
        const posts = await publiModel.findAll();
        console.log('Posts encontrados:', posts); // Verifique o valor de `posts`
        return posts; // Retorne os posts em vez de renderizar
    } catch (error) {
        console.error('Erro ao buscar publicações:', error);
        throw error; 
    }
};
