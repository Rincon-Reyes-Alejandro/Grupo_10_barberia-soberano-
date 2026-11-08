window.addEventListener('load', function() {
    // Seleccionamos el formulario de la página de login
    let form = document.querySelector('form');
    
    form.addEventListener('submit', function(e) {
        // Limpiamos los errores anteriores del front-end
        document.querySelectorAll('.front-error').forEach(el => el.remove());

        // Capturamos los campos
        let email = document.querySelector('input[name="email"]');
        let password = document.querySelector('input[name="password"]');
        
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

        // 1. Validar Email
        let regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (email.value.trim() === '') {
            mostrarError(email, 'Debes ingresar tu correo electrónico.');
        } else if (!regexEmail.test(email.value.trim()) && email.value.trim() !== 'admin') {
            // Permitimos la palabra "admin" por tu lógica de administrador maestro, de lo contrario exigimos formato de correo
            mostrarError(email, 'Debes ingresar un formato de correo válido.');
        }

        // 2. Validar Contraseña
        if (password.value.trim() === '') {
            mostrarError(password, 'Debes ingresar tu contraseña.');
        }

        // Si hay al menos un error, prevenimos el envío del formulario al servidor
        if (errores) {
            e.preventDefault();
        }
    });
});