const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const authMiddleware = require('../middlewares/authMiddleware');

router.get('/', authMiddleware, cartController.index);
router.post('/add', authMiddleware, cartController.add);
router.post('/update', authMiddleware, cartController.update); // <-- NUEVA RUTA
router.post('/checkout', authMiddleware, cartController.checkout); // <-- NUEVA RUTA

module.exports = router;