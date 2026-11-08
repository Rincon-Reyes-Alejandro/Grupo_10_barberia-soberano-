function authMiddleware(req, res, next) {
    // Si NO hay un usuario en sesión, lo mandamos a que se loguee
    if (!req.session || !req.session.usuarioLogueado) {
        return res.redirect('/login');
    }
    // Si está logueado, lo dejamos pasar a la ruta protegida
    next();
}

module.exports = authMiddleware;