const input = document.querySelectorAll(".input__field");
const inputIcon = document.querySelectorAll(".input__icon");

// Convertendo NodeList em array
const inputArray = Array.from(input);

inputIcon.forEach((item, i) => {
    item.addEventListener("click", (e) => {
        e.preventDefault();

        // Verifica se inputArray[i] está definido antes de acessar
        if (inputArray[i]) {
            item.setAttribute(
                'src',
                inputArray[i].getAttribute('type') === 'password' ?
                    '../../img/Login/eye.svg' :
                    '../../img/Login/eye-off.svg'
            );

            inputArray[i].setAttribute(
                'type',
                inputArray[i].getAttribute('type') === 'password' ?
                    'text' :
                    'password'
            );
        }
    });
});
