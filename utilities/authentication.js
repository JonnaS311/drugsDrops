function createUserSession(req, usuario, action){
    // the default mongo id is an objectid, so we need to convert to string
    req.session.usuarioid = usuario.id;
    req.session.usuario = usuario.usuario;

    
    // once is done, the "action" will be exetured once the session was saved in the store (database)
    req.session.save(action);
}

// to logout
function destroyUserAuthSession(req) {
    req.session.usuarioid = null;
    req.session.usuario = null;
}

module.exports= {
    createUserSession: createUserSession,
    destroyUserAuthSession: destroyUserAuthSession,
}