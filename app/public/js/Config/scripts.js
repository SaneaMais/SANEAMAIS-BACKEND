function notify(titulo, texto, tipo, posicao,duracao=3000) {
    new Notify({
        status: tipo,
        title: titulo,
        text:texto.replace(/&lt;/g,"<").replace(/&gt;/g,">") ,
        effect: 'fade',
        speed: 500,
        showIcon: true,
        showCloseButton: true,
        autoclose: true,
        autotimeout: duracao,
        gap: 20,
        distance: 20,
        type: 1,
        position:posicao 
    })
}


// Dispara o evento de clicar no input de imagem quando o botão "Trocar Foto" for clicado
document.getElementById('changeImageOverlay').addEventListener('click', function() {
    document.getElementById('profileImage').click();
});

// Função para pré-visualizar a nova foto de perfil
document.getElementById('profileImage').addEventListener('change', function(event) {
    const preview = document.getElementById('previewProfileImage');
    const file = event.target.files[0];

    // Verifica se o arquivo é uma imagem
    if (file && file.type.startsWith('image/')) {
        const reader = new FileReader();

        // Carrega a imagem no elemento de pré-visualização
        reader.onload = function(e) {
            preview.src = e.target.result;
            preview.style.display = "block"; // Exibe a pré-visualização
        };

        reader.readAsDataURL(file);
    } else {
        preview.style.display = "none"; // Esconde se não for uma imagem válida
    }

    
});

function loadImg(event) {
    var imgPreview = document.getElementById('currentProfileImage');
    imgPreview.src = URL.createObjectURL(event.target.files[0]);
}
