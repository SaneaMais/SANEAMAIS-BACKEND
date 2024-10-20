const { body, validationResult } = require("express-validator");
const ComentarioModel = require("../models/comentarioModel");

exports.criarComentario = async (req, res) => {
    // Exibindo os dados recebidos na requisição para debug
    console.log('Requisição:', req.body);

    const comentario = req.body.comentario?.trim(); // Remover espaços em branco extras
    const postId = req.body.postId;
    const usuarioId = req.session?.autenticado?.id; // Supondo que você armazena o ID do usuário na sessão

    console.log('Dados recebidos:');
    console.log('Comentario:', comentario);
    console.log('Post ID:', postId);
    console.log('Usuario ID:', usuarioId);

    try {
        // Verificação para garantir que o comentário não está vazio
        if (!comentario || comentario === "") {
            throw new Error('O comentário não pode estar vazio.');
        }

        if (!postId || !usuarioId) {
            throw new Error('Os dados fornecidos são inválidos ou incompletos.');
        }

        const data = { comentario, usuarioId, postId };

        // Log dos valores que serão inseridos
        console.log('Valores para inserção:', data);

        // Chamada para o método correto no model (create) passando os dados corretamente
        const idComentario = await ComentarioModel.create(data);

        // Definir uma mensagem de sucesso na sessão
        req.session.dadosNotificacao = {
            titulo: "Comentário criado",
            mensagem: "Seu comentário foi adicionado com sucesso!",
            tipo: "success"
        };

        // Redireciona para a página do post (ou onde desejar)
        res.redirect("/publicacao");
    } catch (error) {
        // Definir uma mensagem de erro na sessão
        req.session.dadosNotificacao = {
            titulo: "Erro",
            mensagem: "Houve um erro ao adicionar o comentário.",
            tipo: "error"
        };

        // Redireciona de volta para a página do post (ou onde desejar)
        res.redirect("/publicacao");
    }
};

// Método para buscar comentários de um post
exports.buscarComentarios = async (req, res) => {
    const postId = req.params.postId;

    try {
        // Busca os comentários do post específico
        const comentarios = await ComentarioModel.findAll(postId);

        // Renderiza a página de publicações com os comentários
        res.render("pages/Publicacao/publi/index", {
            pagina: "publicacao",
            comentarios: comentarios, // Pode ser vazio, mas é um array
            postId: postId, // Enviar também o ID da publicação
            dadosNotificacao: req.session.dadosNotificacao || null
        });
    } catch (error) {
        req.session.dadosNotificacao = {
            titulo: "Erro",
            mensagem: "Erro ao buscar os comentários.",
            tipo: "error"
        };
        res.redirect("/publicacao");
    }
};

