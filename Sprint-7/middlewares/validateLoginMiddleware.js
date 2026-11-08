const { body } = require('express-validator');

module.exports = [
    body('email')
        .notEmpty().withMessage('Debes ingresar tu correo electrónico o usuario.').bail()
        .custom((value) => {
            const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            // Si el valor NO es 'admin' y TAMPOCO cumple con el formato de email, lanzamos error
            if (value !== 'admin' && !regexEmail.test(value)) {
                throw new Error('Debes ingresar un formato de correo válido.');
            }
            return true; // Si es 'admin' o un correo válido, pasa la validación
        }),
    
    body('password')
        .notEmpty().withMessage('Debes ingresar tu contraseña.')
];