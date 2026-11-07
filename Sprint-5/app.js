const express = require('express');
const path = require('path');
const methodOverride = require('method-override');
const fs = require('fs');
const session = require('express-session');
const cookieParser = require('cookie-parser');  

const app = express();
const PORT = 3000;

// Configuración de middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride('_method'));


// Archivos estáticos e motor de vistas
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware para pasar la variable de sesión a todas las vistas EJS
app.use((req, res, next) => {
    // Si hay un usuario en sesión, lo guardamos en res.locals para que EJS lo lea
    if (req.session && req.session.usuarioLogueado) {
        res.locals.usuarioLogueado = req.session.usuarioLogueado;
    } else {
        res.locals.usuarioLogueado = null; // Si no, es null
    }
    next();
});

// Activar el uso de cookies
app.use(cookieParser());

// Configuración de la sesión 
app.use(session({
    secret: 'SecretoSoberanoBarber2026',
    resave: false,
    saveUninitialized: false
}));

// 2. ¡EL MIDDLEWARE MÁGICO! 
app.use((req, res, next) => {
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

// Ruta Principal (Home) única y limpia
app.get('/', (req, res) => {
    const productsFilePath = path.join(__dirname, 'data/products.json');
    const products = JSON.parse(fs.readFileSync(productsFilePath, 'utf-8'));
    
    // Obtenemos de forma segura el estado del usuario (Invitado o Admin)
    const usuarioActual = usersController.getUsuarioLogueado ? usersController.getUsuarioLogueado() : { nombre: "Invitado", esAdmin: false };

    res.render('products/index', { 
        products, 
        usuario: usuarioActual 
    });
});

// Usar enrutadores
app.use('/products', productsRouter);
app.use('/', usersRouter);

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`Servidor del Sprint 4 corriendo en http://localhost:${PORT}`);
});