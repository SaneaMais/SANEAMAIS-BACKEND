document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("form");

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    validateForm();
  });

  const emailInput = document.getElementById("email");
  const userInput = document.getElementById("user");
  const nomeInput = document.getElementById("nome")
  const dataInput = document.getElementById("data_nasc");
  const cepInput = document.getElementById("cep");
  const senhaInput = document.getElementById("senha");
  const confirmarSenhaInput = document.getElementById("confirmasenha");

  emailInput.addEventListener("input", function () {
    emailInput.value = emailInput.value.toLowerCase();
  });

  nomeInput.addEventListener("input", function () {
    nomeInput.value = nomeInput.value.replace(/[^a-zA-Z\s]/g, '');
  }); 

  dataInput.addEventListener("input", function () {
    dataInput.value = dataInput.value
      .replace(/\D/g, '')
      .replace(/(\d{2})(\d{2})(\d{4})/, '$1/$2/$3');
  });


  let url ='https://servicodados.ibge.gov.br/api/v1/localidades/estados/SP/municipios';

  $.getJSON(url, function(data){

    let conteudo = '<ul>';
    $.each(data, function(v,val){
      conteudo += '<li>' +val.nome+'</li>';
    });
    conteudo += '</ul>';

    $("cidade").ejs(conteudo);

  });
  //  cidadeInput.addEventListener("input", function () {
    // cidadeInput.value = cidadeInput.value
      // .replace(/\D/g, '')
      // .replace(/(\d{5})(\d{3})/, '$1-$2');
  //  });

  userInput.addEventListener("input", function () {
    userInput.value = userInput.value.replace(/[^a-zA-Z0-9_-]/g, '');
    if (userInput.value.length > 20) {
      userInput.value = userInput.value.substring(0, 20);
    }
  });

  emailInput.addEventListener("blur", function () {
    validateEmail(emailInput);
  });

  nomeInput.addEventListener("blur", function () {
    validateName(nomeInput);
  });

  userInput.addEventListener("blur", function () {
    validateUsername(userInput);
  });

  dataInput.addEventListener("blur", function () {
    validateDate(dataInput);
  });

  cepInput.addEventListener("blur", function () {
    validateCep(cepInput);
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

  function validateName(input) {
    const name = input.value.trim();
    if (name.length >= 3) {
      clearValidation(input);
    } else {
      setValidation(input, "Nome deve ter no minímo 3 letras");
    }
  }

  function validateDate(input) {
    const date = input.value.trim();
    const parts = date.split('/');
    
    // Verifica se a data está no formato correto (DD/MM/AAAA)
    if (parts.length !== 3) {
      setValidation(input, "Formato de data inválido");
      return;
    }
  
    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1; // Mês é base 0 no Date
    const year = parseInt(parts[2], 10);
  
    // Verifica se a data é válida
    const isValidDate = day > 0 && day <= 31 && month >= 0 && month < 12 && year > 1900;
  
    if (!isValidDate) {
      setValidation(input, "Data de nascimento inválida");
      return;
    }
  
    // Verifica se a pessoa tem pelo menos 16 anos
    const birthDate = new Date(year, month, day);
    if (!checkAge(birthDate)) {
      setValidation(input, "Você deve ter pelo menos 16 anos");
      return;
    }
  
    clearValidation(input);
  }
  
  function checkAge(birthDate) {
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age >= 16;
  }
  

  function validateCep(input) {
    const cep = input.value.replace(/\D/g, "");
    if (cep.length === 8) {
      clearValidation(input);
    } else {
      setValidation(input, "CEP inválido");
    }
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
    const inputs = [emailInput, nomeInput, userInput, dataInput, cepInput, senhaInput, confirmarSenhaInput];

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
