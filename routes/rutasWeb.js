const express = require('express');
const router = express.Router();
//Pasar String a JSON
//El stringfy es para un JSON a String
// let alarmsArray = JSON.parse(jsonAlarms)

// to create tell the session the user is logged in
const authUtil = require('../utilities/authentication');
// to save user entered input data
const sessionFlash = require('../utilities/session-flash');

const Alarma = require('../models/alarma')
const Usuario = require('../models/usuario')


router.get('/', (req, res) => {
    res.redirect('/login');
});

router.get('/login', (req, res) => {
    let titulo = 'Inicio Login';
    // we validate if the user has submitting any data before
    let sessionData = sessionFlash.getSessionData(req);

    // if there's no saved data, we define the dafault data
    if (!sessionData) {
        // default data
        sessionData = {
            usuario: '',
            password: '',
        };
    }
    res.render('login', { tituloWeb: titulo, inputData: sessionData });

});




router.post("/login", async (req, res, next) => {
    // using the data sent by the client form we create a new client
    let usuario = {
        usuario: req.body.usuario,
        password: req.body.password,
    };
    // we searching the created user
    let existingUser;
    try {
        // in the clients collection in database
        existingUser = await Usuario.findOne({ usuario: usuario.usuario });
        // existingUser = await db.getDb().collection('usuarios').findOne({ usuario: usuario.usuario });
    } catch (error) {
        next(error);
        return;
    }

    // Muestra y configuracion de mensaje de error
    const sessionErrorData = {
        title: 'Usuario Incorrecto',
        errorMessage: 'Por favor revisa el nombre de usuario y contraseña',
        usuario: usuario.usuario,
        password: usuario.password,
    }
    // if there's no user registrated
    if (!existingUser) {
        sessionFlash.flashDataToSession(
            req,
            sessionErrorData,
            function () {
                // refresh the page
                res.redirect('/login');
            }
        );
        return;
    }

    // if the password is not correct
    if (existingUser.password !== usuario.password) {
        sessionFlash.flashDataToSession(
            req,
            sessionErrorData,
            function () {
                // refresh the page
                res.redirect('/login');
            }
        );
        return;
    }

    // maybe conversion de usuario

    console.log('Logged in User: [' + existingUser.usuario + ']');
    usuarioActual = existingUser

    // we trate the user as logged in; the function is executed one the session is saved
    authUtil.createUserSession(req, existingUser, function () {
        res.redirect('/cliente/home');
    });


})

router.post("/logout", (req, res) => {
    authUtil.destroyUserAuthSession(req);

    // after logout, we want to redirect the user to...
    res.redirect('/login');
})

router.get('/cliente/home', async (req, res) => {
    try {
        let titulo = 'Bienvenido Nuevamente';
        let arrayAlarmasDB = await Alarma.find();
        arrayAlarmasDB = JSON.stringify(arrayAlarmasDB)
        arrayAlarmasDB = JSON.parse(arrayAlarmasDB)

        for (let i = 0; i < arrayAlarmasDB.length; i++) {

            if (arrayAlarmasDB[i].usuario._id != req.session.usuarioid) {
                arrayAlarmasDB.splice(i, 1)
            }
        }


        arrayAlarmasDB = JSON.stringify(arrayAlarmasDB)
        res.render('index', { titulo: titulo, alarmsArray: arrayAlarmasDB, cajon: "0" });
    } catch (error) {
        console.log(error)
    }
});


router.get('/cliente/cajon/:id', async (req, res) => {
    const id = req.params.id

    try {
        let arrayAlarmasDB = await Alarma.find();
        arrayAlarmasDB = JSON.stringify(arrayAlarmasDB)
        arrayAlarmasDB = JSON.parse(arrayAlarmasDB)

        for (let i = 0; i < arrayAlarmasDB.length; i++) {

            if (arrayAlarmasDB[i].usuario._id != req.session.usuarioid) {
                arrayAlarmasDB.splice(i, 1)
            }
        }

        arrayAlarmasDB = JSON.stringify(arrayAlarmasDB)

        // console.log(req.session.usuarioid)
        // console.log(arrayAlarmasDB)
        if (id == "1") {
            res.render('cajon', { titulo: 'Primer Cajón', alarmsArray: arrayAlarmasDB, cajon: id });
        } else if (id == "2") {
            res.render('cajon', { titulo: 'Segundo Cajón', alarmsArray: arrayAlarmasDB, cajon: id });
        } else if (id == "3") {
            res.render('cajon', { titulo: 'Tercer Cajón', alarmsArray: arrayAlarmasDB, cajon: id });
        } else if (id == "4") {
            res.render('cajon', { titulo: 'Cuarto Cajón', alarmsArray: arrayAlarmasDB, cajon: id });
        } else {
            res.status(404).render('404', {
                tituloWeb: 'Error 404',
                descripcion: 'Dirección IP inválida'
            })
        }




    } catch (error) {
        console.log(error)
    }
});



router.post('/cliente/cajon', async (req, res) => {
    const { hour, day, info, cajon, usuario } = req.body
    let new_alarm = {
        hour: hour,
        day: day,
        info: info,
        cajon: cajon,
        usuario: usuario
    }
    try {
        await Alarma.create(new_alarm)
        console.log(new_alarm)

        res.json({
            estado: true
        })


    } catch (error) {
        console.log(error)
        res.json({
            estado: false
        })
    }


})

router.delete('/cliente/cajon/:id', async (req, res) => {
    const id = req.params.id
    // console.log(id)

    //No se puede redirigir directamente, por eso se maneja un json
    //Se captura en un js
    try {

        const mascotaDB = await Alarma.findByIdAndDelete({ _id: id })
        console.log(id)
        res.json({
            estado: true
        })

    } catch (error) {
        console.log(error)
        res.json({
            estado: false
        })
    }
})

module.exports = router;
