document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("form");

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    validateForm();
  });

  const RsocialInput = document.getElementById("razao_social_instituicao");
  const emailInput = document.getElementById("email");
  const userInput = document.getElementById("user");
  const cnpjInput = document.getElementById("cnpj_instituicao");
  const senhaInput = document.getElementById("senha");
  const confirmarSenhaInput = document.getElementById("confirmasenha");

  RsocialInput.addEventListener("input", function () {
    RsocialInput.value = RsocialInput.value.toLowerCase();
  });
 
  emailInput.addEventListener("input", function () {
    emailInput.value = emailInput.value.toLowerCase();
  });

  userInput.addEventListener("input", function () {
    userInput.value = userInput.value.toLowerCase();
  });

  cnpjInput.addEventListener("input", function () {
    cnpjInput.value = cnpjInput.value
      .replace(/\D/g, '')
      .replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
  });

  emailInput.addEventListener("blur", function () {
    validateEmail(emailInput);
  });

  userInput.addEventListener("blur", function () {
    validateUsername(userInput);
  });  

  cnpjInput.addEventListener("blur", function () {
    validatecnpj(cnpjInput);
  });
 
  senhaInput.addEventListener("blur", function () {
    validateSenha(senhaInput);
  });

  confirmarSenhaInput.addEventListener("blur", function () {
    validateConfirmarSenha(confirmarSenhaInput, senhaInput);
  });

  function validateEmail(input) {
    const email = input.value;
    if (email.includes("@")) {
      clearValidation(input);
    } else {
      setValidation(input, "Email inválido");
    }
  }
  
  function validateUsername(input) {
    const username = input.value;
    if (username.length >= 3) {
      clearValidation(input);
    } else {
      setValidation(input, "Nome de usuário inválido");
    }
  }

  function validatecnpj(input) {
    const cnpj = input.value.replace(/\D/g, ""); // Remove caracteres não numéricos

    // Verifica se o CNPJ tem exatamente 14 dígitos
    if (cnpj.length !== 14) {
        setValidation(input, "CNPJ inválido. Deve conter 14 dígitos.");
        return false;
    }

    // Verifica se o CNPJ contém apenas números
    if (!/^\d+$/.test(cnpj)) {
        setValidation(input, "CNPJ deve conter apenas números.");
        return false;
    }

    clearValidation(input);
    return true;
  }

  function validateSenha(input) {
    const senha = input.value;
    if (senha.length === 0) {
      setValidation(input, "Campo obrigatório");
    } else if (senha.length < 8) {
      setValidation(input, "A senha deve ter pelo menos 8 caracteres");
    } else if (!containsLowerCase(senha) || !containsUpperCase(senha) || !containsNumber(senha) || !containsSpecialCharacter(senha)) {
      setValidation(input, "A senha deve conter pelo menos uma letra maiúscula, uma letra minúscula, um número e um caractere especial");
    } else {
      clearValidation(input);
    }
  }

  function validateConfirmarSenha(confirmarInput, senhaInput) {
    if (confirmarInput.value !== senhaInput.value) {
      setValidation(confirmarInput, "As senhas não coincidem");
    } else {
      clearValidation(confirmarInput);
    }
  }

  function containsLowerCase(str) {
    return /[a-z]/.test(str);
  }

  function containsUpperCase(str) {
    return /[A-Z]/.test(str);
  }

  function containsNumber(str) {
    return /\d/.test(str);
  }

  function containsSpecialCharacter(str) {
    return /[!@#$%^&*]/.test(str);
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
    const inputs = [RsocialInput, emailInput, userInput, senhaInput, confirmarSenhaInput];

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
