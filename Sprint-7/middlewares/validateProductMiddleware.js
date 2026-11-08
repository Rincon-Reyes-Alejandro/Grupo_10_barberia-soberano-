const path = require('path');
const { body } = require('express-validator');

module.exports = [
    body('name') // Asegúrate de que coincida con el atributo 'name' de tu input HTML
        .notEmpty().withMessage('El nombre del producto es obligatorio.').bail()
        .isLength({ min: 5 }).withMessage('El nombre debe tener al menos 5 caracteres.'),
    
    body('description') // Asegúrate de que coincida con tu textarea
        .notEmpty().withMessage('La descripción es obligatoria.').bail()
        .isLength({ min: 20 }).withMessage('La descripción debe tener al menos 20 caracteres.'),
    
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