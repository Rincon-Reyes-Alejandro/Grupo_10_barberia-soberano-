const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const db = require('../models'); 

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
            // Atrapamos errores de express-validator
            const resultValidation = validationResult(req);

            if (resultValidation.errors.length > 0) {
                return res.render('users/register', {
                    errors: resultValidation.mapped(),
                    oldData: req.body // Mantiene los datos para que no borre todo el formulario
                });
            }

            const { firstName, lastName, email, password } = req.body;

            // ENCRIPTAR LA CONTRASEÑA
            const hashedPassword = bcrypt.hashSync(password, 10);

            // Capturar la imagen
            const userImage = req.file ? req.file.filename : 'default-user.png';

            // Crear el nuevo usuario en MySQL
            await db.User.create({
                name: `${firstName} ${lastName}`, 
                email: email,
                password: hashedPassword,
                image: userImage,
                phone: "",
                role_id: 2 
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
            // 1. Atrapamos errores de express-validator
            const resultValidation = validationResult(req);

            if (resultValidation.errors.length > 0) {
                return res.render('users/login', {
                    errors: resultValidation.mapped(),
                    oldData: req.body // Para que no tenga que volver a escribir su email
                });
            }

            const { email, password } = req.body;

            // Administrador maestro simulado
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
                include: ['role'] 
            });

            if (userToLogin) {
                // VERIFICAR CONTRASEÑA
                const isPasswordValid = bcrypt.compareSync(password, userToLogin.password);

                if (isPasswordValid) {
                    req.session.usuarioLogueado = {
                        id: userToLogin.id,
                        nombre: userToLogin.name,
                        email: userToLogin.email,
                        esAdmin: userToLogin.role_id === 1,
                        image: userToLogin.image || "default-user.png",
                        phone: userToLogin.phone || "",
                        address: "" 
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
            
            req.session.usuarioLogueado.phone = phone;
            req.session.usuarioLogueado.address = address; 

            let newImage = req.session.usuarioLogueado.image;
            if (req.file) {
                newImage = req.file.filename;
                req.session.usuarioLogueado.image = newImage;
            }

            if (req.session.usuarioLogueado.email !== "admin@soberano.barber") {
                await db.User.update({
                    phone: phone,
                    image: newImage
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

    // 8. Getter
    getUsuarioLogueado: () => usuarioLogueado
};

module.exports = usersController;