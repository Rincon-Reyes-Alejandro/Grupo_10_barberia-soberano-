const express = require('express');
const path = require('path');
const methodOverride = require('method-override');
const fs = require('fs');
const session = require('express-session');
const cookieParser = require('cookie-parser');  

// 1. Importamos la base de datos de Sequelize
const db = require('./models');

const app = express();
const PORT = 3000;

// Configuración de middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride('_method'));

// Archivos estáticos y motor de vistas
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Activar el uso de cookies
app.use(cookieParser());

// Configuración de la sesión (Debe ir ANTES de intentar leer res.locals)
app.use(session({
    secret: 'SecretoSoberanoBarber2026',
    resave: false,
    saveUninitialized: false
}));

// EL MIDDLEWARE MÁGICO (Corregido y unificado)
app.use((req, res, next) => {
    // Si hay un usuario en sesión, lo guardamos en res.locals para que EJS lo lea
    if (req.session && req.session.usuarioLogueado) {
        res.locals.usuarioLogueado = req.session.usuarioLogueado;
    } else {
        res.locals.usuarioLogueado = null;
    }
    next();
});

// Importar controladores y enrutadores
const usersController = require('./controllers/usersController');
const productsRouter = require('./routes/productsRoutes');
const usersRouter = require('./routes/usersRoutes');
const cartRouter = require('./routes/cartRoutes');

// 2. Ruta Principal (Home) conectada a MySQL
app.get('/', async (req, res) => {
    try {
        // Leemos los productos desde la base de datos con su categoría
        const products = await db.Product.findAll({
            include: ['category']
        });
        
        // Verificamos si hay alguien logueado para adaptar la vista
        const usuarioActual = req.session.usuarioLogueado || { nombre: "Invitado", esAdmin: false };

        res.render('products/index', { 
            products, 
            usuario: usuarioActual 
        });
    } catch (error) {
        console.error("Error al cargar la página principal:", error);
        res.status(500).send("Error al cargar el inicio");
    }
});

// Usar enrutadores
app.use('/products', productsRouter);
app.use('/cart', cartRouter);
app.use('/', usersRouter);

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`Servidor del Sprint 6 corriendo en http://localhost:${PORT}`);
});