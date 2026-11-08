window.addEventListener('load', function() {
    // Seleccionamos el formulario de la página
    let form = document.querySelector('form');
    
    form.addEventListener('submit', function(e) {
        // Limpiamos los errores del front-end anteriores (si el usuario intentó enviar varias veces)
        document.querySelectorAll('.front-error').forEach(el => el.remove());

        // Capturamos los campos
        let firstName = document.querySelector('input[name="firstName"]');
        let lastName = document.querySelector('input[name="lastName"]');
        let email = document.querySelector('input[name="email"]');
        let password = document.querySelector('input[name="password"]');
        let image = document.querySelector('input[name="image"]');
        
        let errores = false; // Bandera para saber si detenemos el envío

        // Función auxiliar para imprimir el error en rojo debajo del input
        function mostrarError(input, mensaje) {
            let errorDiv = document.createElement('div');
            errorDiv.classList.add('front-error');
            errorDiv.style.color = '#d9534f';
            errorDiv.style.fontSize = '0.85rem';
            errorDiv.style.marginTop = '5px';
            errorDiv.style.fontWeight = 'bold';
            errorDiv.innerText = mensaje;
            input.parentNode.appendChild(errorDiv);
            errores = true;
        }

        // 1. Validar Nombre
        if (firstName.value.trim() === '') {
            mostrarError(firstName, 'Debes escribir un nombre.');
        } else if (firstName.value.trim().length < 2) {
            mostrarError(firstName, 'El nombre debe tener al menos 2 caracteres.');
        }

        // 2. Validar Apellido
        if (lastName.value.trim() === '') {
            mostrarError(lastName, 'Debes escribir un apellido.');
        } else if (lastName.value.trim().length < 2) {
            mostrarError(lastName, 'El apellido debe tener al menos 2 caracteres.');
        }

        // 3. Validar Email
        let regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (email.value.trim() === '') {
            mostrarError(email, 'Debes escribir un correo electrónico.');
        } else if (!regexEmail.test(email.value.trim())) {
            mostrarError(email, 'Debes escribir un formato de correo válido.');
        }

        // 4. Validar Contraseña
        if (password.value.trim() === '') {
            mostrarError(password, 'Debes escribir una contraseña.');
        } else if (password.value.trim().length < 8) {
            mostrarError(password, 'La contraseña debe tener al menos 8 caracteres.');
        }

        // 5. Validar Imagen (solo si el usuario seleccionó un archivo)
        if (image.value) {
            let extension = image.value.substring(image.value.lastIndexOf('.')).toLowerCase();
            let extensionesPermitidas = ['.jpg', '.jpeg', '.png', '.gif'];
            if (!extensionesPermitidas.includes(extension)) {
                mostrarError(image, `Las extensiones permitidas son ${extensionesPermitidas.join(', ')}`);
            }
        }

        // Si hay al menos un error, prevenimos el envío del formulario al servidor
        if (errores) {
            e.preventDefault();
        }
    });
});