require('dotenv').config();
const express = require("express");
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();


const Paciente = require('./models/paciente.models');


app.use(express.json());
app.use(cors());

const Conexion = async()=> { 
    try {
        await mongoose.connect(process.env.MONGOURI);
        console.log('CONNECTED TO MONGODB!!');
       
    } catch (error) {
        console.log(error)
        throw new Error('FAILED TO CONNECT TO MONGODB')
    }   
  }

Conexion();


app.get('/pacientes', async (req, res) => {
    console.log('TRYING TO FETCH pacienteS');
    try {
      const Pacientes = await Paciente.find();
      res.status(200).json({
        pacientes:Pacientes.map((Paciente) => ({
          id: Paciente.id,
          nombre: Paciente.nombre,
          identificacion: Paciente.identificacion,
        })),
      });
      console.log('FETCHED pacientes');
    } catch (err) {
      console.error('ERROR FETCHING pacientes');
      console.error(err.message);
      res.status(500).json({ message: 'Failed to load pacientes.' });
    }
});


app.post('/pacientes', async (req, res) => {
    console.log('TRYING TO STORE paciente');
    const nombre = req.body.nombre;
    const identificacion = req.body.identificacion;
  
    if (!nombre || nombre.trim().length === 0) {
      console.log('INVALID INPUT - NO nombre');
      return res.status(422).json({ message: 'Invalid paciente nombre.' });
    }

      
    if (!identificacion || identificacion.trim().length === 0) {
      console.log('INVALID INPUT - NO nombre');
      return res.status(422).json({ message: 'Invalid paciente identificacion.' });
    }
  
    const paciente = new Paciente({
      nombre: nombre,
      identificacion:identificacion
    });
  
    try {
      await paciente.save();
      res
        .status(201)
        .json({ message: 'paciente saved', paciente});
      console.log('STORED NEW paciente');
    } catch (err) {
      console.error('ERROR FETCHING pacienteS');
      console.error(err.message);
      res.status(500).json({ message: 'Failed to save paciente.' });
    }
  });

app.put('/paciente/:id', async (req, res) => {
    console.log('TRYING TO UPDATE paciente');
    try {
     const {id} = req.params;
     const {...data } =  req.body;
     console.log(id,data)
     await Paciente.findByIdAndUpdate(id,data )
    console.log('UPDATE paciente');
    res.status(200).json({ message: 'Actualiza dato' });
    } catch (err) {
      console.error('ERROR FETCHING paciente');
      console.error(err.message);
      res.status(500).json({ message: 'Failed to update paciente.' });
    }
});


app.delete('/paciente/:id', async (req, res) => {
    console.log('TRYING TO DELETE paciente');
    try {
         await Paciente.deleteOne({ _id: req.params.id });
      res.status(200).json({ message: 'Deleted paciente!' });
      console.log('DELETED paciente');
    } catch (err) {
      console.error('ERROR FETCHING pacienteS');
      console.error(err.message);
      res.status(500).json({ message: 'Failed to delete paciente.' });
    }
  });


app.listen(process.env.PORT, ()=> { console.log('SERVIDOR INICIADO')});
