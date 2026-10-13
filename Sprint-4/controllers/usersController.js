const fs = require('fs');
const path = require('path');

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
    register: (req, res) => {
        const users = getUsers();
        const { firstName, lastName, email, password } = req.body;

        // Validar si el usuario ya existe
        const userExists = users.find(u => u.email === email);
        if (userExists) {
            return res.render('users/register', { error: 'El correo electrónico ya está registrado.' });
        }

        const newUser = {
            id: users.length > 0 ? Number(users[users.length - 1].id) + 1 : 1,
            firstName,
            lastName,
            email,
            password,
            category: "user",
            phone: "",
            address: ""
        };

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

        // Administrador maestro por defecto
        if (email === "admin" && password === "96385274") {
            usuarioLogueado = {
                nombre: "Administrador",
                email: "admin@soberano.barber",
                esAdmin: true,
                phone: "3001234567",
                address: "Calle Principal #12-34"
            };
            return res.redirect('/');
        }

        const users = getUsers();
        const userToLogin = users.find(u => u.email === email && u.password === password);

        if (userToLogin) {
            usuarioLogueado = {
                nombre: userToLogin.firstName,
                email: userToLogin.email,
                esAdmin: false,
                phone: userToLogin.phone || "",
                address: userToLogin.address || ""
            };
            return res.redirect('/profile');
        } else {
            return res.render('users/login', { error: 'Credenciales inválidas. Verifica tu correo y contraseña.' });
        }
    },

    // 5. Cerrar Sesión (Logout)
    logout: (req, res) => {
        usuarioLogueado = {
            nombre: "Invitado",
            email: "",
            esAdmin: false,
            phone: "",
            address: ""
        };
        res.redirect('/');
    },

    // 6. Vista de Perfil
    profile: (req, res) => {
        res.render('users/profile', { usuario: usuarioLogueado });
    },

    // 7. Actualizar Datos del Perfil (Teléfono y Dirección)
    updateProfile: (req, res) => {
        const { phone, address } = req.body;
        
        // Actualizamos la sesión actual
        usuarioLogueado.phone = phone;
        usuarioLogueado.address = address;

        // Actualizamos en el archivo users.json si no es admin
        if (!usuarioLogueado.esAdmin) {
            const users = getUsers();
            const userIndex = users.findIndex(u => u.email === usuarioLogueado.email);

            if (userIndex !== -1) {
                users[userIndex].phone = phone;
                users[userIndex].address = address;
                fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2));
            }
        }

        res.redirect('/profile');
    },

    // 8. Getter para que el app.js consulte quién está logueado
    getUsuarioLogueado: () => usuarioLogueado
};

module.exports = usersController;