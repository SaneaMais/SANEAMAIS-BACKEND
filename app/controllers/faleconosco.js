const { enviarEmail } = require("../util/email");

const EMAIL_ADMIN = 'carol2711campos@gmail.com'; // Substitua pelo e-mail do administrador

const FaleConoscoController = {
    // Método para exibir a página Fale Conosco
    mostrarPagina: (req, res) => {
        res.render("pages/FaleConoco/index", {
            dadosNotificacao: req.session.dadosNotificacao || null // Passa dadosNotificacao se existir
        });
        req.session.dadosNotificacao = null; // Limpa a notificação após renderizar
    },

    // Método para enviar a mensagem
    enviarMensagem: (req, res) => {
        const { nome, email, mensagem } = req.body;

        // Criar o conteúdo do e-mail
        const conteudoEmail = `
            Nome: ${nome}
            E-mail: ${email}
            Mensagem: ${mensagem}
        `;

        // Enviar o e-mail para o administrador
        enviarEmail(EMAIL_ADMIN, 'Nova Mensagem do Fale Conosco', null, conteudoEmail, (error) => {
            if (error) {
                req.session.dadosNotificacao = {
                    titulo: "Erro",
                    mensagem: "Erro ao enviar a mensagem. Tente novamente mais tarde.",
                    tipo: "error"
                };
                return res.redirect("/FaleConoco"); // Redireciona para a mesma página para mostrar a notificação
            }
        
            // Definindo a notificação de sucesso
            req.session.dadosNotificacao = {
                titulo: "Mensagem Enviada com Sucesso",
                mensagem: `Obrigado, ${nome}! Sua mensagem foi enviada ao administrador.`,
                tipo: "success"
            };
            res.redirect("/FaleConoco"); // Redireciona para a mesma página para mostrar a notificação
        });
    }
};

module.exports = FaleConoscoController;
