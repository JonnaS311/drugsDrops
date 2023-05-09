const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const alarmaSchema = new Schema({
    hour: String,
    day: Array,
    info:String,
    cajon: String,
    usuario: Object
});
  

//Crear modelo
const Alarma = mongoose.model('Alarma', alarmaSchema)


module.exports = Alarma;
