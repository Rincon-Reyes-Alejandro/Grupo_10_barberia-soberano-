const express = require('express');
const router = express.Router();
const path = require('path');
const multer = require('multer');
const productsController = require('../controllers/productsController');
// 1. Importamos el middleware de validación
const validateProduct = require('../middlewares/validateProductMiddleware');

// Configuración de Multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '../public/images'));
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'img-' + uniqueSuffix + path.extname(file.originalname));
    }
});
const upload = multer({ storage });

router.get('/', productsController.index);
router.get('/create', productsController.create);
router.get('/:id', productsController.detail);

// 2. Agregamos validateProduct en la creación (POST)
router.post('/', upload.single('image'), validateProduct, productsController.store);

router.get('/:id/edit', productsController.edit);

// 3. Agregamos validateProduct en la edición (PUT)
router.put('/:id', upload.single('image'), validateProduct, productsController.update);

router.delete('/:id', productsController.destroy);

module.exports = router;