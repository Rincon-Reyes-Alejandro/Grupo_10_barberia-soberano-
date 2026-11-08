const express = require('express');
const router = express.Router();
const path = require('path');
const multer = require('multer');
const usersController = require('../controllers/usersController');
const guestMiddleware = require('../middlewares/guestMiddleware');
const authMiddleware = require('../middlewares/authMiddleware');

// 1. Configuración de Multer para usuarios
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // La carpeta donde se guardarán las fotos de perfil
        cb(null, path.join(__dirname, '../public/images/users'));
    },
    filename: (req, file, cb) => {
        // Nombre único para cada imagen (ej: user-1634567890123.jpg)
        const newFilename = 'user-' + Date.now() + path.extname(file.originalname);
        cb(null, newFilename);
    }
});
const upload = multer({ storage });

// 2. Rutas de Registro (Protegidas: Solo invitados)
router.get('/register', guestMiddleware, usersController.registerForm);
router.post('/register', upload.single('image'), usersController.register);

// 3. Rutas de Login (Protegidas: Solo invitados)
router.get('/login', guestMiddleware, usersController.loginForm);
router.post('/login', usersController.login);

// 4. Ruta de Logout (Protegida: Solo logueados)
router.get('/logout', authMiddleware, usersController.logout);

// 5. Rutas de Perfil (Protegidas: Solo logueados)
router.get('/profile', authMiddleware, usersController.profile);
router.put('/profile/update', authMiddleware, upload.single('image'), usersController.updateProfile);

module.exports = router;