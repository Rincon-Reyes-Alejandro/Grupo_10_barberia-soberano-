const bcrypt = require('bcryptjs');
const db = require('../models'); // Asegúrate de que apunte a la carpeta donde está tu index.js de Sequelize

// Variable temporal para no romper tu app.js si la está consultando
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

    // 2. Acción de Registro (Guarda en MySQL con Sequelize)
    register: async (req, res) => {
        try {
            const { firstName, lastName, email, password } = req.body;

            // 1. Validar si el usuario ya existe en la BD
            const userExists = await db.User.findOne({ where: { email: email } });
            
            if (userExists) {
                return res.render('users/register', { error: 'El correo electrónico ya está registrado.' });
            }

            // 2. ENCRIPTAR LA CONTRASEÑA
            const hashedPassword = bcrypt.hashSync(password, 10);

            // 3. Capturar la imagen
            const userImage = req.file ? req.file.filename : 'default-user.png';

            // 4. Crear el nuevo usuario en MySQL
            // Nota: Unimos firstName y lastName porque en la base de datos solo creamos la columna 'name'
            await db.User.create({
                name: `${firstName} ${lastName}`, 
                email: email,
                password: hashedPassword,
                image: userImage,
                phone: "",
                role_id: 2 // 2 es el ID para 'client' según nuestra base de datos
            });

            res.redirect('/login');

        } catch (error) {
            console.error("Error en registro:", error);
            res.status(500).send("Error interno al registrar el usuario");
        }
    },  

    // 3. Vista de Login
    loginForm: (req, res) => {
        res.render('users/login');
    },

    // 4. Procesar Login (Consulta MySQL)
    login: async (req, res) => {
        try {
            const { email, password } = req.body;

            // Administrador maestro por defecto (dejé tu acceso original intacto por si lo usas de emergencia)
            if (email === "admin" && password === "96385274") {
                req.session.usuarioLogueado = {
                    nombre: "Administrador Maestro",
                    email: "admin@soberano.barber",
                    esAdmin: true,
                    image: "default-user.png",
                    phone: "3001234567",
                    address: "Calle Principal #12-34"
                };
                return res.redirect('/');
            }

            // Buscar al usuario por correo en la Base de Datos
            const userToLogin = await db.User.findOne({ 
                where: { email: email },
                include: ['role'] // Traemos el rol para saber si es admin
            });

            if (userToLogin) {
                // VERIFICAR CONTRASEÑA
                const isPasswordValid = bcrypt.compareSync(password, userToLogin.password);

                if (isPasswordValid) {
                    // GUARDAR EN SESIÓN MANTENIENDO TU ESTRUCTURA ORIGINAL
                    req.session.usuarioLogueado = {
                        id: userToLogin.id,
                        nombre: userToLogin.name,
                        email: userToLogin.email,
                        esAdmin: userToLogin.role_id === 1, // ID 1 es admin en nuestra BD
                        image: userToLogin.image || "default-user.png",
                        phone: userToLogin.phone || "",
                        address: "" // Lo dejamos vacío temporalmente porque no existe en la BD SQL
                    };
                    return res.redirect('/profile');
                } else {
                    return res.render('users/login', { error: 'Credenciales inválidas. Verifica tu contraseña.' });
                }
            } else {
                return res.render('users/login', { error: 'No existe una cuenta registrada con este correo.' });
            }
        } catch (error) {
            console.error("Error en login:", error);
            res.status(500).send("Error interno en el inicio de sesión");
        }
    },

    // 5. Cerrar Sesión (Logout)
    logout: (req, res) => {
        req.session.destroy();
        return res.redirect('/');
    },

    // 6. Vista de Perfil
    profile: (req, res) => {
        const usuarioEnSesion = req.session.usuarioLogueado;
        
        if (!usuarioEnSesion) {
            return res.redirect('/login');
        }

        res.render('users/profile', { usuario: usuarioEnSesion });
    },

    // 7. Actualizar Datos del Perfil (Guarda en MySQL)
    updateProfile: async (req, res) => {
        try {
            const { phone, address } = req.body;
            
            // 1. Actualizamos la sesión actual
            req.session.usuarioLogueado.phone = phone;
            req.session.usuarioLogueado.address = address; // La sesión mantiene la dirección viva

            let newImage = req.session.usuarioLogueado.image;
            if (req.file) {
                newImage = req.file.filename;
                req.session.usuarioLogueado.image = newImage;
            }

            // 2. Actualizamos en MySQL si no es el admin maestro simulado
            if (req.session.usuarioLogueado.email !== "admin@soberano.barber") {
                await db.User.update({
                    phone: phone,
                    image: newImage
                    // Nota: 'address' se guarda solo en sesión porque no creamos esa columna en MySQL
                }, {
                    where: { email: req.session.usuarioLogueado.email }
                });
            }

            res.redirect('/profile');
        } catch (error) {
            console.error("Error al actualizar perfil:", error);
            res.status(500).send("Error al actualizar los datos");
        }
    },

    // 8. Getter para que el app.js no se rompa
    getUsuarioLogueado: () => usuarioLogueado
};

module.exports = usersController;