const express = require('express');
const { dbConnection } = require('./database/config');
require('dotenv').config();
const cors = require('cors');


// Crear el servidor de express 
const app = express();

//Configurar CORS
app.use(cors());

// Base de datos
dbConnection();

//Rutas  userDb: mean_user - password: I0ylsvQt4g9CTi0c
app.get('/', (req, res) => {

    res.json({
        ok: true,
        msn: 'Hola Mundo'
    });

});


app.listen(process.env.PORT, () => {
    console.log('Servidor corriendo en puerto ' + 3000 );    
})

