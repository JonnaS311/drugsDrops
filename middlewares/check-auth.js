function checkAuthStatus(req, res, next) {
    //  looking for the variable we configured in the autentication file saving the id of the user
    const usuario = req.session.usuario;

    //  if there's no userid saved, it means the user is no logged in
    if (!usuario) {
        
        return next();
    }

    // saving the data 
    res.locals.usuario = usuario;
    res.locals.idusuario = req.session.usuarioid;
    res.locals.isAuth = true;

    next();
}

module.exports = checkAuthStatus;