document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("form");

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    validateForm();
  });

  const emailInput = document.getElementById("email");
  const nomeuInput = document.getElementById("nomeu");
  const nomeInput = document.getElementById("nome")
  const dataInput = document.getElementById("data");
  const cepInput = document.getElementById("cep");
  const passwordInput = document.getElementById("password");

 
  emailInput.addEventListener("input", function () {
    emailInput.value = emailInput.value.toLowerCase();
  });

  nomeInput.addEventListener("input", function () {
    nomeInput.value = nomeInput.value.replace(/[^a-zA-Z]/g, '');
  }); 

  dataInput.addEventListener("input", function () {
    dataInput.value = dataInput.value
      .replace(/\D/g, '')
      .replace(/(\d{2})(\d{2})(\d{4})/, '$1/$2/$3');
  });

 
  cepInput.addEventListener("input", function () {
    cepInput.value = cepInput.value
      .replace(/\D/g, '')
      .replace(/(\d{5})(\d{3})/, '$1-$2');
  });

  nomeuInput.addEventListener("input", function () {
    nomeuInput.value = nomeuInput.value.replace(/[^a-zA-Z0-9]/g, '');
  });

  emailInput.addEventListener("blur", function () {
    validateEmail(emailInput);
  });

  nomeInput.addEventListener("blur", function () {
    validateName(nomeInput);
  });

  nomeuInput.addEventListener("blur", function () {
    validateUsername(nomeuInput);
  });

  dataInput.addEventListener("blur", function () {
    validateDate(dataInput);
  });

  cepInput.addEventListener("blur", function () {
    validateCep(cepInput);
  });

  passwordInput.addEventListener("blur", function () {
    validatePassword(passwordInput);
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
  
  function validatePassword(input) {
    const password = input.value;
    if (password.length === 0) {
        setValidation(input, "Campo obrigatório");
    } else if (password.length < 8) {
        setValidation(input, "A senha deve ter pelo menos 8 caracteres");
    } else if (!containsLowerCase(password) || !containsUpperCase(password) || !containsNumber(password) || !containsSpecialCharacter(password)) {
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
    const inputs = [emailInput, nomeInput, nomeuInput, dataInput, cepInput, passwordInput];

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


