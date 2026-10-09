const express = require('express');
const path = require('path');
const app = express();

const PORT = 3000;

// Configurar middleware para leer los datos enviados por formularios POST
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Configurar archivos estáticos (CSS, imágenes) desde la carpeta public
app.use(express.static(path.join(__dirname, 'public')));

// Configurar el motor de vistas EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Variable de sesión simulada para controlar el rol de administrador
let usuarioLogueado = {
    nombre: "Invitado",
    email: "",
    esAdmin: false
};

// ================= RUTAS DE VISTAS =================

// Ruta Principal (Home / Index) - Envía el estado del usuario
app.get('/', (req, res) => {
    res.render('products/index', { usuario: usuarioLogueado });
});

// Ruta de Login (Vista)
app.get('/login', (req, res) => {
    res.render('users/login');
});

// Ruta POST para procesar el inicio de sesión (Reconoce al Admin)
app.post('/login', (req, res) => {
    const { email, password } = req.body;

    // Credenciales de Administrador solicitadas
    if (email === "admin" && password === "96385274") {
        usuarioLogueado = {
            nombre: "Administrador",
            email: "admin@soberano.barber",
            esAdmin: true
        };
        return res.redirect('/');
    } else {
        // Usuario normal de prueba
        usuarioLogueado = {
            nombre: email.split('@')[0],
            email: email,
            esAdmin: false
        };
        return res.redirect('/profile');
    }
});

// Ruta de Registro (Vista)
app.get('/register', (req, res) => {
    res.render('users/register');
});

// Ruta para el Perfil de Usuario (Soporta /profile y /perfil)
const renderProfile = (req, res) => {
    res.render('users/profile', { usuario: usuarioLogueado });
};
app.get('/profile', renderProfile);
app.get('/perfil', renderProfile);

// Ruta para crear producto (Protegida: solo admin)
app.get('/products/create', (req, res) => {
    if (usuarioLogueado.esAdmin) {
        res.render('products/createProduct');
    } else {
        res.redirect('/login');
    }
});

// Ruta para editar producto (Protegida: solo admin)
app.get('/products/edit', (req, res) => {
    if (usuarioLogueado.esAdmin) {
        res.render('products/editProduct');
    } else {
        res.redirect('/login');
    }
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`Servidor del Sprint 3 corriendo en http://localhost:${PORT}`);
});