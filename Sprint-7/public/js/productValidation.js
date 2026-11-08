window.addEventListener('load', function() {
    // Seleccionamos el formulario (funciona tanto para crear como para editar)
    let form = document.querySelector('form');
    
    form.addEventListener('submit', function(e) {
        // Limpiamos errores previos
        document.querySelectorAll('.front-error').forEach(el => el.remove());

        // Capturamos los campos
        let name = document.querySelector('input[name="name"]');
        let description = document.querySelector('textarea[name="description"]');
        let price = document.querySelector('input[name="price"]');
        let image = document.querySelector('input[name="image"]');
        
        let errores = false;

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

        // 1. Validar Nombre (Mínimo 5 caracteres)
        if (name.value.trim() === '') {
            mostrarError(name, 'El nombre del producto es obligatorio.');
        } else if (name.value.trim().length < 5) {
            mostrarError(name, 'El nombre debe tener al menos 5 caracteres.');
        }

        // 2. Validar Descripción (Mínimo 20 caracteres)
        if (description.value.trim() === '') {
            mostrarError(description, 'La descripción es obligatoria.');
        } else if (description.value.trim().length < 20) {
            mostrarError(description, 'La descripción debe tener al menos 20 caracteres.');
        }

        // 3. Validar Precio
        if (price.value.trim() === '' || Number(price.value) <= 0) {
            mostrarError(price, 'Debes ingresar un precio válido mayor a 0.');
        }

        // 4. Validar Imagen (Solo si el usuario seleccionó un archivo)
        if (image && image.value) {
            let extension = image.value.substring(image.value.lastIndexOf('.')).toLowerCase();
            let extensionesPermitidas = ['.jpg', '.jpeg', '.png', '.gif'];
            if (!extensionesPermitidas.includes(extension)) {
                mostrarError(image, `Las extensiones permitidas son ${extensionesPermitidas.join(', ')}`);
            }
        }

        // Si hay errores, detenemos el envío
        if (errores) {
            e.preventDefault();
        }
    });
});