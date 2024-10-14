
    function toggleCommentForm(postId) {
        const form = document.getElementById(`commentForm_${postId}`);
        if (form.style.display === "none") {
            form.style.display = "block";
        } else {
            form.style.display = "none";
        }
    }

    async function enviarComentario(event, postId) {
        event.preventDefault(); // Evita o envio padrão do formulário

        const comentarioInput = document.querySelector(`#commentForm_${postId} input[name="comentario"]`);
        const comentario = comentarioInput.value;

        // Verifica se o comentário não está vazio
        if (!comentario) {
            alert("Por favor, insira um comentário.");
            return;
        }

        try {
            const response = await fetch('/comentario', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    comentario: comentario,
                    postId: postId
                })
            });

            if (!response.ok) {
                throw new Error('Erro ao enviar comentário.');
            }

            const result = await response.json();
            console.log(result.message); // Exibe a mensagem de sucesso
            comentarioInput.value = ''; // Limpa o campo de comentário

            // Você pode atualizar a UI aqui para mostrar o novo comentário, se necessário
        } catch (error) {
            console.error('Erro:', error);
            alert('Erro ao enviar comentário.'); // Alerta para o usuário
        }
    }
