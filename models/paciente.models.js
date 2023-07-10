const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const PacienteSchema = new Schema({
  nombre: String,
  identificacion: String, 
});



const PacienteModel = mongoose.model('Paciente', PacienteSchema);

module.exports = PacienteModel;

