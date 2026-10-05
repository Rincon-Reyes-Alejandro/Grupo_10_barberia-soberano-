// Importamos el módulo de Express
const express = require('express');
const path = require('path');

// Inicializamos la aplicación de Express
const app = express();

// Definimos el puerto en el que va a correr el servidor (ej. puerto 3000)
const PORT = 3000;

// Configurar los archivos estáticos (CSS, imágenes, etc.) para que Express pueda leerlos desde la carpeta 'public'
app.use(express.static(path.join(__dirname, 'public')));

// --- RUTAS (Controlador básico para servir las vistas HTML) ---

// 1. Ruta para la página de Inicio (Home)
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views/index.html'));
});

// 2. Ruta para el Detalle del Producto
app.get('/productDetail', (req, res) => {
    res.sendFile(path.join(__dirname, 'views/productDetail.html'));
});

// 3. Ruta para el Carrito de Compras
app.get('/productCart', (req, res) => {
    res.sendFile(path.join(__dirname, 'views/productCart.html'));
});

// 4. Ruta para el Formulario de Registro
app.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, 'views/register.html'));
});

// 5. Ruta para el Formulario de Login
app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'views/login.html'));
});

// Ponemos a escuchar el servidor en el puerto definido
app.listen(PORT, () => {
    console.log(`Servidor corriendo con éxito en http://localhost:${PORT}`);
});