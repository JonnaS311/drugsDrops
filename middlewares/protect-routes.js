function protectRoutes (req, res, next) {
    //La ruta necesita verificación
    if (req.path.startsWith('/cliente') && res.locals.isAuth !== true){
        res.status(404).render('404', {
            tituloWeb: 'Error 404',
            descripcion: 'Dirección IP inválida'
        })
    }
    // we allow to continue to the next middleware
    next();
}

module.exports = protectRoutes;