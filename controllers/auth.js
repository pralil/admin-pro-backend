const { response } = require('express');
const bcrypt = require('bcryptjs');

const res = require('express/lib/response');
const Usuario = require('../models/usuario');

const { generarJWT } = require('../helpers/jwt');


const login = async( req, res = response ) => {

    const { email, password } = req.body;

    try {

        // Verificar email
        const usuarioDB = await Usuario.findOne({ email });

        if ( !usuarioDB ) {
            return res.status(404).json({
                ok: false,
                msg: 'Email no encontrado'
            })
        }

        // Verificar contraseña
        const validPassword = bcrypt.compareSync( password, usuarioDB.password );

        if ( !validPassword ) {
            return res.status(400).json({
                ok: false,
                msg: 'El password no corresponde'
            })
        }
         
        // Generar el JWT TOKEN
        const token = await generarJWT( usuarioDB.id );

        

        res.status(200).json({
            ok: true,
            msg: 'Hola mundo',
            token
        });

    } catch(error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado'
        });
    }

}

module.exports = {
    login,
}