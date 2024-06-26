document.addEventListener("DOMContentLoaded", function() {
    const input = document.querySelectorAll(".input__wrapper input[type='password']");
    const inputIcon = document.querySelectorAll(".input__icon");

    inputIcon.forEach((item, i) => {
        item.addEventListener("click", (e) => {
            e.preventDefault();

            const inputField = input[i];
            const isPassword = inputField.getAttribute('type') === 'password';

            item.setAttribute(
                'src',
                isPassword ? '../../img/Login/eye.svg' : '../../img/Login/eye-off.svg'
            );

            inputField.setAttribute(
                'type',
                isPassword ? 'text' : 'password'
            );
        });
    });
});
