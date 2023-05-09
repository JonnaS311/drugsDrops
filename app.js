const express = require('express');

//Crear sesión
const expressSession = require('express-session');
const createSessionConfig = require('./config/session');
const checkAuthStatusMiddleware = require('./middlewares/check-auth');
const protectRoutesMiddleware = require('./middlewares/protect-routes');

const bodyParser = require('body-parser');
const app = express();

//Permite leer formulario el primero son formularios y el segundo json
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

require('dotenv').config()

// SESSION MIDDLEWARE
const sessionConfig = createSessionConfig();
app.use(expressSession(sessionConfig));

// check the user status
app.use(checkAuthStatusMiddleware);
// MERGING ROTES
app.use(protectRoutesMiddleware);

const PUERTO = process.env.PORT || 3001;


//Conexión a Base de Datos
const mongoose = require('mongoose');

const uri = `mongodb+srv://${process.env.USER}:${process.env.PASSWORD}@cluster0.0pxc1mu.mongodb.net/${process.env.DBNAME}?retryWrites=true&w=majority`

mongoose.connect(uri,
    {useNewUrlParser: true, useUnifiedTopology: true})
    .then(()=> console.log('Base de datos conectada'))
    .catch(e => console.log(e))


//Motor de plantillas 
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views')


app.use('/', require('./routes/rutasWeb'))
app.use(express.static(__dirname + '/public'))


app.use((req, res, next) =>{
    res.status(404).render('404', {
        tituloWeb: 'Error 404',
        descripcion: 'Dirección IP inválida'
    })
})



app.listen(PUERTO, () => {
    console.log(`El servidor esta escuchando por el puerto ${PUERTO}`)
})