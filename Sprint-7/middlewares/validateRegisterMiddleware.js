const path = require('path');
const { body } = require('express-validator');
const db = require('../models');

module.exports = [
    body('firstName')
        .notEmpty().withMessage('Debes escribir un nombre.').bail()
        .isLength({ min: 2 }).withMessage('El nombre debe tener al menos 2 caracteres.'),
    
    body('lastName')
        .notEmpty().withMessage('Debes escribir un apellido.').bail()
        .isLength({ min: 2 }).withMessage('El apellido debe tener al menos 2 caracteres.'),
    
    body('email')
        .notEmpty().withMessage('Debes escribir un correo electrónico.').bail()
        .isEmail().withMessage('Debes escribir un formato de correo válido.').bail()
        .custom(async (value) => {
            const usuarioExistente = await db.User.findOne({ where: { email: value } });
            if (usuarioExistente) {
                throw new Error('Este correo ya está registrado en nuestra base de datos.');
            }
            return true;
        }),
    
    body('password')
        .notEmpty().withMessage('Debes escribir una contraseña.').bail()
        .isLength({ min: 8 }).withMessage('La contraseña debe tener al menos 8 caracteres.'),
    
    body('image').custom((value, { req }) => {
        let file = req.file;
        let acceptedExtensions = ['.jpg', '.jpeg', '.png', '.gif'];

        if (file) {
            let fileExtension = path.extname(file.originalname).toLowerCase();
            if (!acceptedExtensions.includes(fileExtension)) {
                throw new Error(`Las extensiones permitidas son ${acceptedExtensions.join(', ')}`);
            }
        }
        return true; 
    })
];