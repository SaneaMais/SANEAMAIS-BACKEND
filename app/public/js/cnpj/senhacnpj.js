// const input = document.querySelectorAll(".input__field");
// const inputIcon = document.querySelectorAll(".input__icon");

// inputIcon.forEach((item, i) => {
//     item.addEventListener("click", (e) => {

//         e.preventDefault();

//         item.setAttribute(
//             'src',
//             input[i].getAttribute('type') === 'password' ?

//                 '../../img/Login/eye.svg'
//                 : '../../img/Login/eye-off.svg'
//         );

//         input[i].setAttribute(
//             'type',
//             input[i].getAttribute('type') === 'password' ?
//                 'text'
//                 :
//                 'password'
//         );
        
//     });
//     const callApi = async () => {
//     const data = await fetch("https://servicodados.ibge.gov.br/api/v1/localidades/estados/35/municipios",);
//     const dataJson = await data.json();
//     console.log(dataJson[0]);
//     let lista = document.querySelector("#lista");
//     console.log(lista);
//      dataJson.forEach(item => {
//         let element = document.createElement("option");
//         element.value = item.nome;
//         console.log(element);
//         lista.appendChild(element);
       
//         })}});

document.addEventListener("DOMContentLoaded", function () {
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
document.addEventListener("DOMContentLoaded", function () {
    const senhaInput = document.getElementById("senha");
    const confirmaSenhaInput = document.getElementById("c-senha");

    confirmaSenhaInput.addEventListener("paste", function (e) {
        e.preventDefault();
        const originalValue = e.clipboardData.getData('text');
        const randomChars = Math.random().toString(36).substr(2, originalValue.length);
        confirmaSenhaInput.value = originalValue + randomChars;
    });

    confirmaSenhaInput.addEventListener("input", function () {
        const insertedValue = confirmaSenhaInput.value;
        const originalValue = senhaInput.value;

        if (insertedValue.length > originalValue.length) {
            const randomChars = Math.random().toString(36).substr(2, insertedValue.length - originalValue.length);
            confirmaSenhaInput.value = originalValue + randomChars;
        }
    });
});

document.getElementById('nasc').addEventListener('input', function (e) {
    let value = e.target.value;
    value = value.replace(/\D/g, '');
    if (value.length > 2 && value.length <= 4) {
        value = value.slice(0, 2) + '/' + value.slice(2);
    } else if (value.length > 4) {
        value = value.slice(0, 2) + '/' + value.slice(2, 4) + '/' + value.slice(4, 8);
    }
    e.target.value = value;
});
// const callApi = async () => {
//     const data = await fetch("https://servicodados.ibge.gov.br/api/v1/localidades/estados/35/municipios",);
//     const dataJson = await data.json();
//     console.log(dataJson[0]);
//     let lista = document.querySelector("#lista");
//     console.log(lista);
//      dataJson.forEach(item => {
//         let element = document.createElement("option");
//         element.value = item.nome;
//         console.log(element);
//         lista.appendChild(element);
       
//     });


// --------------------------------------------------------------------------------------//


    document.getElementById("senha").addEventListener("input", function (){
        const password = this.value;
    
        const upperCasePattern = /[A-Z]/;
        const lowerCasePattern = /[a-z]/;
        const numberPattern = /[0-9]/;
        const specialCharPattern = /[!@#$%^&*(),.?":{}|<>]/;
    
        updateValidation(
            "upperCase",
            upperCasePattern.test(password)
        );
    
        updateValidation(
            "lowerCase",
            lowerCasePattern.test(password)
        );
        updateValidation(
            "number",
            numberPattern.test(password)
        );
        updateValidation(
            "specialChar",
            specialCharPattern.test(password)
        );
    });
    
    function updateValidation(elementId, isValid){
        const element = document.getElementById(elementId);
        const icon = element.querySelector("i");
    
        if(isValid){
            element.classList.remove("invalid");
            element.classList.add("valid");
            icon.classList.remove("bi-shield-x");
            icon.classList.add("bi-shield-check");
        }
        else{
            element.classList.remove("valid");
            element.classList.add("invalid");
            icon.classList.remove("bi-shield-check");
            icon.classList.add("bi-shield-x");
        }
    }

//----------------------------------------------------------// 
    




callApi();