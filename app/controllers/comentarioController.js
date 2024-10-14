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

        // Resposta de sucesso com o ID do novo comentário
        res.status(201).json({ message: 'Comentário criado com sucesso!', id: idComentario });
    } catch (error) {
        // Log do erro e resposta de erro
        console.error('Erro ao criar comentário:', error);
        res.status(500).json({ error: 'Erro ao criar comentário.' });
    }
};

// Método para buscar comentários de um post
exports.buscarComentarios = async (req, res) => {
    const postId = req.params.postId;

    try {
        // Busca os comentários do post específico
        const comentarios = await ComentarioModel.findAll(postId);
        // Retorna os comentários em formato JSON
        res.status(200).json(comentarios); 
    } catch (error) {
        console.error(error); 
        res.status(500).json({ error: 'Erro ao buscar comentários.' });
    }
};
