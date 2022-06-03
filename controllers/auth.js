const { response } = require('express');
const bcrypt = require('bcryptjs');

const res = require('express/lib/response');
const Usuario = require('../models/usuario');

const { generarJWT } = require('../helpers/jwt');
const { googleVerify } = require('../helpers/google-verify');


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

const googleSignIn = async(req, res = response) => {


    const googleToken = req.body.token;



    try {

        const { name, email, picture } = await googleVerify( googleToken );

        // Verificar el email
        const usuarioDB = await Usuario.findOne({ email });
        let usuario;

        if ( !usuarioDB ) {
            // Si no existe el usuario se establece el usuario logeado con google
            usuario = new Usuario({
                nombre: name,
                email,
                password: '@@@',
                img: picture,
                google: true
            })
        } else {
            usuario = usuarioDB;
            usuario.google = true;
        }

        //Guardar en base de datos
        await usuario.save();

        // Generar el Token - JWT
        const token = await generarJWT( usuarioDB.id );
        
        res.json({
            ok: true,
            token
        })

    } catch(error) {
        res.status(401).json({
            ok: false,
            msg: 'Token no es correcto'
        })    
    }

    googleVerify(req.body.token);

}

const renewToken = async(req, res = response) => {

    const uid = req.uid;
    console.log(uid);

    // Generar el Token - JWT
    const token = await generarJWT( uid );

    //obtener Usuario por uid
    const usuarioDB = await Usuario.findById( uid );
    if ( !usuarioDB ) {
        return res.status(401).json({
            ok: false,
            msg: 'No se pudo onbtener la informacion, Usuario no encontrado'
        })
    }


    res.json({
        ok: true,
        token,
        usuario: usuarioDB

    })
}

module.exports = {
    login,
    googleSignIn,
    renewToken
}