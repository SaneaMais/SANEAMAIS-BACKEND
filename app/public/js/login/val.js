var password = document.getElementById("password");
    var messageSenha = document.getElementById("messageSenha");
    var entrar = document.getElementById("Entrar");
    var inputEmail = document.getElementById("inputEmail");
    var emailRegex = /^[a-z0-9.]+@[a-z0-9]+\.[a-z]+(\.[a-z]+)?$/i;
    var messageEmail = document.getElementById("messageEmail");

    messageEmail.style.marginLeft = "5px";
    messageSenha.style.marginLeft = "5px";

    function validateInput() {
      var inputValue = inputEmail.value;
      if (emailRegex.test(inputValue)) {
        messageEmail.textContent = "";
        messageEmail.style.color = "";
        messageEmail.style.fontSize = "";
        inputEmail.style.border = "";
        return "email";
      }  else {
        messageEmail.textContent = "Formato inválido ( digite seu E-mail )";
        messageEmail.style.color = "red";
        messageEmail.style.fontSize = "12px";
        inputEmail.style.border = "1px solid red";
        return "invalido";
      }
    }

    function senhaValida() {
      if (password.value.length < 8) {
        messageSenha.textContent = "Senha inválida";
        messageSenha.style.color = "red";
        messageSenha.style.fontSize = "12px";
        password.style.border = "1px solid red";
      } else {
        messageSenha.textContent = "";
        messageSenha.style.color = "";
        messageSenha.style.fontSize = "";
        password.style.border = "";
      }
    }

    entrar.addEventListener("click", function () {
      var inputType = validateInput();
      senhaValida();
      if (inputType === "invalido") {
        messageEmail.textContent = "inválido (E-mail ou número de telefone)";
        messageEmail.style.color = "red";
        messageEmail.style.fontSize = "12px";
        inputEmail.style.border = "1px solid red";
      }
    });

    inputEmail.addEventListener("input", function () {
      if (validateInput() !== "invalido") {
        inputEmail.style.border = "";
        messageEmail.textContent = "";
      }
    });

    password.addEventListener("input", function () {
      if (password.value.length >= 8) {
        password.style.border = "";
        messageSenha.textContent = "";
      }
    });