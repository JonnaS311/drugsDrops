const mongoose = require('mongoose');
const Schema = mongoose.Schema;

  
const usuarioSchema = new Schema({
    usuario:String,
    password: String
});

//Crear modelo
const Usuario = mongoose.model('Usuario', usuarioSchema)


module.exports = Usuario; 