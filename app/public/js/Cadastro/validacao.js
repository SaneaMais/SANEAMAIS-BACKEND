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
    const pswConfirmaSenha = document.querySelector("#confirmasenha")
  
   
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
  
    pswConfirmaSenha.addEventListener("paste", function(e){
      e.preventDefault()
    })
   
    cepInput.addEventListener("input", function () {
      cepInput.value = cepInput.value
        .replace(/\D/g, '')
        .replace(/(\d{5})(\d{3})/, '$1-$2');
    });
  
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
      validatesenha(senhaInput);
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
      const name = input.value;
      if (name.length > 3) {
        clearValidation(input);
      } else {
        setValidation(input, "Nome inválido");
      }
    }
  
    function validateDate(input) {
      const date = input.value.replace(/\D/g, "");
      if (date.length === 8) {
        clearValidation(input);
      } else {
        setValidation(input, "Data de nascimento inválida");
      }
    }
  
    function validateCep(input) {
      const cep = input.value.replace(/\D/g, "");
      if (cep.length === 8) {
        clearValidation(input);
      } else {
        setValidation(input, "CEP inválido");
      }
    }
    
    function validatesenha(input) {
      const senha = input.value;
      if (senha.length === 0) {
          setValidation(input, "Campo obrigatório");
      } else if (senha.length < 8) {
          setValidation(input, "A senha deve ter pelo menos 8 caracteres");
      } else if (!containsLowerCase(senha) || !containsUpperCase(senha) || !containsNumber(senha) || !containsSpecialCharacter(password)) {
          setValidation(input, "A senha deve conter pelo menos uma letra maiúscula, uma letra minúscula, um número e um caractere especial");
      } else {
          clearValidation(input);
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
      const inputs = [emailInput, nomeInput, userInput, dataInput, cepInput, senhaInput];
  
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
  
  
  