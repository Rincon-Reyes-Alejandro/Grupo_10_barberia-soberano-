const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs'); // <- NUEVA LÍNEA

const usersFilePath = path.join(__dirname, '../data/users.json');

function getUsers() {
    const fileContent = fs.readFileSync(usersFilePath, 'utf-8');
    return JSON.parse(fileContent);
}

// Variable temporal para recordar al usuario que inició sesión
let usuarioLogueado = {
    nombre: "Invitado",
    email: "",
    esAdmin: false,
    phone: "",
    address: ""
};

const usersController = {
    // 1. Vista de Registro
    registerForm: (req, res) => {
        res.render('users/register');
    },

    // 2. Acción de Registro (Guarda en users.json)
    // Acción de Registro (Guarda en users.json)
    register: (req, res) => {
        const users = getUsers();
        const { firstName, lastName, email, password } = req.body;

        // 1. Validar si el usuario ya existe
        const userExists = users.find(u => u.email === email);
        if (userExists) {
            return res.render('users/register', { error: 'El correo electrónico ya está registrado.' });
        }

        // 2. ENCRIPTAR LA CONTRASEÑA usando bcryptjs
        const hashedPassword = bcrypt.hashSync(password, 10);

        // 3. Capturar la imagen de Multer (si no sube foto, pone una por defecto)
        const userImage = req.file ? req.file.filename : 'default-user.png';

        // 4. Crear el nuevo usuario
        const newUser = {
            id: users.length > 0 ? Number(users[users.length - 1].id) + 1 : 1,
            firstName,
            lastName,
            email,
            password: hashedPassword, // ¡Guardamos la contraseña encriptada!
            image: userImage,         // ¡Guardamos el nombre de la foto de perfil!
            category: "user",
            phone: "",
            address: ""
        };

        // 5. Guardar en el JSON y redirigir
        users.push(newUser);
        fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2));

        res.redirect('/login');
    },  

    // 3. Vista de Login
    loginForm: (req, res) => {
        res.render('users/login');
    },

    // 4. Procesar Login
    login: (req, res) => {
        const { email, password } = req.body;

        // Administrador maestro por defecto (manteniendo el acceso original)
        if (email === "admin" && password === "96385274") {
            req.session.usuarioLogueado = {
                nombre: "Administrador",
                email: "admin@soberano.barber",
                esAdmin: true,
                image: "default-user.png",
                phone: "3001234567",
                address: "Calle Principal #12-34"
            };
            return res.redirect('/');
        }

        const users = getUsers();
        // Buscar al usuario por correo
        const userToLogin = users.find(u => u.email === email);

        if (userToLogin) {
            // VERIFICAR CONTRASEÑA: Compara la ingresada con la encriptada
            const isPasswordValid = bcrypt.compareSync(password, userToLogin.password);

            if (isPasswordValid) {
                // GUARDAR EN SESIÓN: Si la contraseña es correcta, iniciamos su sesión privada
                req.session.usuarioLogueado = {
                    nombre: userToLogin.firstName,
                    email: userToLogin.email,
                    esAdmin: userToLogin.category === "admin",
                    image: userToLogin.image || "default-user.png",
                    phone: userToLogin.phone || "",
                    address: userToLogin.address || ""
                };
                return res.redirect('/profile');
            } else {
                return res.render('users/login', { error: 'Credenciales inválidas. Verifica tu contraseña.' });
            }
        } else {
            return res.render('users/login', { error: 'No existe una cuenta registrada con este correo.' });
        }
    },

    // 5. Cerrar Sesión (Logout)
    logout: (req, res) => {
        // Limpiamos y destruimos la sesión del navegador
        req.session.destroy();
        return res.redirect('/');
    },

    // 6. Vista de Perfil
    profile: (req, res) => {
        // Leemos el usuario directamente de la sesión actual
        const usuarioEnSesion = req.session.usuarioLogueado;
        
        if (!usuarioEnSesion) {
            return res.redirect('/login'); // Si no hay sesión, lo enviamos a loguearse
        }

        res.render('users/profile', { usuario: usuarioEnSesion });
    },

    // 7. Actualizar Datos del Perfil
    updateProfile: (req, res) => {
        const { phone, address } = req.body;
        
        // 1. Actualizamos la sesión actual con teléfono y dirección
        req.session.usuarioLogueado.phone = phone;
        req.session.usuarioLogueado.address = address;

        // Si el usuario subió una NUEVA foto, la actualizamos en la sesión
        if (req.file) {
            req.session.usuarioLogueado.image = req.file.filename;
        }

        // 2. Actualizamos en el archivo users.json si no es admin
        if (!req.session.usuarioLogueado.esAdmin) {
            const users = getUsers();
            const userIndex = users.findIndex(u => u.email === req.session.usuarioLogueado.email);

            if (userIndex !== -1) {
                users[userIndex].phone = phone;
                users[userIndex].address = address;
                
                // Si hay nueva foto, la reemplazamos en el JSON
                if (req.file) {
                    users[userIndex].image = req.file.filename;
                }
                
                fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2));
            }
        }

        res.redirect('/profile');
    },

    // 8. Getter para que el app.js consulte quién está logueado
    getUsuarioLogueado: () => usuarioLogueado
};

module.exports = usersController;