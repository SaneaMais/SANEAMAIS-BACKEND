const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
const https = require('https');
const moment = require('moment');

const publiModel = require("../models/publiModel");

// Função para criar uma nova publicação
exports.criarPublicacao = (req, res) => {
    const { comentarios_posts } = req.body;
    const USUARIOS_id_usuario1 = req.session.usuarioId;

    console.log('Dados recebidos para criar publicação:', {
        comentarios_posts,
        USUARIOS_id_usuario1,
        img_posts,
    });
    
  
    publiModel.create({ comentarios_posts, USUARIOS_id_usuario1})
        .then(() => {
            res.redirect("Publicacao"); 
        })
        .catch(error => {
            console.error(error);
            res.status(500).send('Erro ao criar publicação');
        });
};

// Função para buscar todas as publicações e exibir no feed
exports.buscarPublicacoes = async (req, res, next) => {
    try {
        const posts = await publiModel.findAll();
        console.log('Posts encontrados:', posts); // Verifique o valor de `posts`
        // req.posts = posts; 
        res.render("pages/Publicacao/publi/index", { 
            listaErros: null,
            pagina: "Publicacao",
            dadosNotificacao:null,
            logado: req.session.autenticado,
            posts: posts 
          });
    } catch (error) {
        console.error('Erro ao buscar publicações:', error);
        req.posts = []; // Define como array vazio em caso de erro
        
    }
};

