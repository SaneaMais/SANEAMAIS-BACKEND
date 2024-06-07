document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("form");
  
    form.addEventListener("submit", function (event) {
      event.preventDefault();
      validateForm();
    });
  

    const passwordInput = document.getElementById("password");
  
    passwordInput.addEventListener("blur", function () {
      validatePassword(passwordInput);
  });
  
  
    function validatePassword(input) {
      const password = input.value;
      if (password.length === 0) {
          setValidation(input, "Campo obrigatório");
      } else if (password.length < 8) {
          setValidation(input, "A senha deve ter pelo menos 8 caracteres");
      } else {
          clearValidation(input);
      }
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
      const inputs = [emailInput, numeroInput, nomeInput, dataInput, cepInput, passwordInput];
  
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
  
  
  