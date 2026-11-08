function guestMiddleware(req, res, next) {
    // Si existe un usuario en sesión, lo redirigimos a su perfil
    if (req.session && req.session.usuarioLogueado) {
        return res.redirect('/profile');
    }
    // Si no está logueado, lo dejamos pasar a la ruta solicitada (ej. login o registro)
    next();
}

module.exports = guestMiddleware;