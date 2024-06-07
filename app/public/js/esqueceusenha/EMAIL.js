document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("form");
  
    form.addEventListener("submit", function (event) {
        event.preventDefault();
        validateForm();
    });
  
    const emailInput = document.getElementById("email");
  
    emailInput.addEventListener("input", function () {
        emailInput.value = emailInput.value.toLowerCase();
    });
  
    emailInput.addEventListener("blur", function () {
        validateEmail(emailInput);
        if (emailInput.validity.valid) {
            enviarEmailConfirmacao(emailInput.value);
        }
    });
  
    function validateEmail(input) {
        const email = input.value;
        if (email.includes("@")) {
            clearValidation(input);
        } else {
            setValidation(input, "Email inválido");
        }
    }
  
    function enviarEmailConfirmacao(emailUsuario) {
        // Aqui você precisa adicionar a lógica para enviar um e-mail de confirmação para o endereço de e-mail do usuário
        // Por exemplo:
        // Use uma API de e-mail como SendGrid ou Gmail para enviar um e-mail de confirmação para o endereço de e-mail fornecido pelo usuário
        // O e-mail de confirmação pode conter um link especial para redefinir a senha ou recuperar a conta
    }
  
    function clearValidation(input) {
        input.style.border = "";
        const errorMessage = input.nextElementSibling;
        errorMessage.textContent = "";
    }
  
    function setValidation(input, message) {
        input.style.border = "1px solid red";
        const errorMessage = input.nextElementSibling;
        errorMessage.textContent = message;
        errorMessage.style.color = "red";
    }
  
    function validateForm() {
        let isValid = true;
        const inputs = [emailInput];
  
        inputs.forEach(function (input) {
            if (input.value.trim() === "") {
                setValidation(input, "Campo obrigatório");
                isValid = false;
            }
        });
  
        if (isValid) {
            form.submit();
        }
    }
  });
  