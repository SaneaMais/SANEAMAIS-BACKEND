const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER, // Seu e-mail
        pass: process.env.EMAIL_PASS,  // Sua senha, ou preferencialmente a senha configurada para App password
    },
    tls: {
        secure: false,
        ignoreTLS: true,
        rejectUnauthorized: false, // Ignorar certificado digital - APENAS EM DESENVOLVIMENTO
    },
});

function enviarEmail(to, subject, text = null, html = null, callback) {
    // Define as opções do e-mail
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to,
        subject,
    };

    // Adiciona o corpo do e-mail, seja texto ou HTML
    if (text) {
        mailOptions.text = text;
    }
    if (html) {
        mailOptions.html = html;
    }

    // Envia o e-mail
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log('Erro ao enviar e-mail:', error);
            if (callback && typeof callback === 'function') {
                callback(error); // Passa o erro para o callback, se fornecido
            }
        } else {
            console.log('E-mail enviado:', info.response);
            if (callback && typeof callback === 'function') {
                callback(null, info); // Chama a função de callback com sucesso
            }
        }
    });
}

module.exports = { enviarEmail };
