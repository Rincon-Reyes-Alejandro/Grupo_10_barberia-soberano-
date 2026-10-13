const express = require('express');
const router = express.Router();
const usersController = require('../controllers/usersController');

router.get('/register', usersController.registerForm);
router.post('/register', usersController.register);

router.get('/login', usersController.loginForm);
router.post('/login', usersController.login);

// Línea 10 (Asegúrate de que apunte a usersController.logout):
router.get('/logout', usersController.logout);

router.get('/profile', usersController.profile);
router.put('/profile/update', usersController.updateProfile);

module.exports = router;