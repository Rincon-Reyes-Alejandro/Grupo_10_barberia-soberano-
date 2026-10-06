const express = require('express');
const path = require('path');
const app = express();

const PORT = 3000;

// Configurar archivos estáticos (CSS, imágenes) desde la carpeta public
app.use(express.static(path.join(__dirname, 'public')));

// Configurar el motor de vistas EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Ruta Principal (Home / Index)
app.get('/', (req, res) => {
    res.render('products/index');
});

// Ruta de Login
app.get('/login', (req, res) => {
    res.render('users/login');
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`Servidor del Sprint 3 corriendo en http://localhost:${PORT}`);
});
// Ruta para ver el formulario de creación de productos
app.get('/products/create', (req, res) => {
    res.render('products/createProduct');
});

// Ruta para ver el formulario de edición de productos
app.get('/products/edit', (req, res) => {
    res.render('products/editProduct');
});