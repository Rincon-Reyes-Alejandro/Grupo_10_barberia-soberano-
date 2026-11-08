const express = require('express');
const router = express.Router();
const path = require('path');
const multer = require('multer');
const usersController = require('../controllers/usersController');
const guestMiddleware = require('../middlewares/guestMiddleware');
const authMiddleware = require('../middlewares/authMiddleware');
const validateRegister = require('../middlewares/validateRegisterMiddleware'); // Importamos validaciones
const validateLogin = require('../middlewares/validateLoginMiddleware');

// 1. Configuración de Multer para usuarios
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '../public/images/users'));
    },
    filename: (req, file, cb) => {
        const newFilename = 'user-' + Date.now() + path.extname(file.originalname);
        cb(null, newFilename);
    }
});
const upload = multer({ storage });

// 2. Rutas de Registro (Protegidas: Solo invitados)
router.get('/register', guestMiddleware, usersController.registerForm);
// Agregamos el validateRegister justo después de cargar la imagen
router.post('/register', upload.single('image'), validateRegister, usersController.register);

// 3. Rutas de Login (Protegidas: Solo invitados)
router.get('/login', guestMiddleware, usersController.loginForm);
router.post('/login', validateLogin, usersController.login); // <-- Agregamos validateLogin aquí

// 4. Ruta de Logout (Protegida: Solo logueados)
router.get('/logout', authMiddleware, usersController.logout);

// 5. Rutas de Perfil (Protegidas: Solo logueados)
router.get('/profile', authMiddleware, usersController.profile);
router.put('/profile/update', authMiddleware, upload.single('image'), usersController.updateProfile);

module.exports = router;