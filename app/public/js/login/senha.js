const input = document.querySelectorAll(".input__field");
const inputIcon = document.querySelectorAll(".input__icon");

inputIcon.forEach((item, i) => {
    item.addEventListener("click", (e) => {

        e.preventDefault();

        item.setAttribute(
            'src',
            input[i].getAttribute('type') === 'password' ?

                '../../img/Login/eye.svg'
                : '../../img/Login/eye-off.svg'
        );

        input[i].setAttribute(
            'type',
            input[i].getAttribute('type') === 'password' ?
                'text'
                :
                'password'
        );
    });
})
