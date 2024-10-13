document.addEventListener("DOMContentLoaded", function () {
    const passwordWrappers = document.querySelectorAll(".input__wrapper");

    passwordWrappers.forEach(wrapper => {
        const inputField = wrapper.querySelector("input[type='password']");
        const toggleIcon = wrapper.querySelector(".input__icon");

        toggleIcon.addEventListener("click", (e) => {
            e.preventDefault();
            
            // Verifica se o campo está como senha ou texto
            const isPassword = inputField.type === 'password';
            
            // Altera o tipo do input e o ícone de acordo com o estado
            inputField.type = isPassword ? 'text' : 'password';
            toggleIcon.src = isPassword ? '../../img/Login/eye.svg' : '../../img/Login/eye-off.svg';
            
            // Acessibilidade: altera o título/aria-label do botão
            toggleIcon.title = isPassword ? 'Ocultar senha' : 'Mostrar senha';
        });
    });

    // Validação de senha
    document.getElementById('senha').addEventListener('input', function (e) {
        const password = e.target.value;
        
        const upperCase = document.getElementById('upperCase');
        const lowerCase = document.getElementById('lowerCase');
        const number = document.getElementById('number');
        const specialChar = document.getElementById('specialChar');

        // Verificações
        const hasUpperCase = /[A-Z]/.test(password);
        const hasLowerCase = /[a-z]/.test(password);
        const hasNumber = /[0-9]/.test(password);
        const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

        // Atualiza a classe dos itens para verde se a condição for atendida
        upperCase.classList.toggle('valid', hasUpperCase);
        upperCase.classList.toggle('invalid', !hasUpperCase);

        lowerCase.classList.toggle('valid', hasLowerCase);
        lowerCase.classList.toggle('invalid', !hasLowerCase);

        number.classList.toggle('valid', hasNumber);
        number.classList.toggle('invalid', !hasNumber);

        specialChar.classList.toggle('valid', hasSpecialChar);
        specialChar.classList.toggle('invalid', !hasSpecialChar);
    });
});
