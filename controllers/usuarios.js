const { response } = require('express');
const Usuario = require('../models/usuario');
const  bcrypt = require('bcryptjs');
const { generarJWT } = require('../helpers/jwt');
 


const getUsuarios = async( req, res ) => {

    const usuarios = await Usuario.find({}, 'nombre email role google');

    res.json({
        ok: true,
        usuarios,
        uid: req.uid
    });
}


const crearUsuario = async( req, res = response ) => {

    const {email, password} = req.body;

    console.log(email);

    try {

        const existeEmail = await Usuario.findOne({ email }); 

        if ( existeEmail ) {
            return res.status(400).json({
                ok: false,
                msg: 'El correo ya esta registrado'
            });
        }


        
        const usuario = new Usuario( req.body );
        
        // Hashear la contraseña
        const salt = bcrypt.genSaltSync(10);
        usuario.password = bcrypt.hashSync( password, salt );

        //Generar token
        // Generar el JWT TOKEN
        const token = await generarJWT( usuario.id );

        

        //Guardar Usuarios
        await usuario.save();
    
        return res.status(201).json({
            ok: true,
            usuario,
            token
        });
         
    } catch(error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Error inesperado... revisar logs'    
        });
    }



}

const actualizarUsuarios = async(req, res = response) => {
    
    //TODO valida Token y validar si es el usuario corretco

    const uid = req.params.uid;
   
    // const {} = req.body;

    try {

        const usuarioDB = await Usuario.findById( uid ); 

        if ( !usuarioDB ) {
            return res.status(404).json({
                ok: false,
                msg: 'No existe usuario con ese ID' 
            });
        }

        // Actualizaciones
        const { password, google, email, ...campos } = req.body;

        if ( usuarioDB.email !== email ) {
      
            const existeEmail = await Usuario.findOne({ email });
            if ( existeEmail ) {
                return res.status(400).json({
                    ok: false,
                    msg: 'Ya existe un usuario con ese email'
                });
            }

        }

        campos.email = email;
        const usuarioActualizado = await Usuario.findByIdAndUpdate(uid, campos, { new: true });

        res.json({
            ok: true,
            usuario: usuarioActualizado
        });


    } catch(error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado'
        });
    }
}
 
const borrarUsuario = async(req, res = response ) => {

    const uid = req.params.uid;

    try {
        const usuarioDB = await Usuario.findById( uid ); 

        if ( !usuarioDB ) {
            return res.status(404).json({
                ok: false,
                msg: 'No existe usuario con ese ID' 
            });
        }

        await Usuario.findByIdAndDelete(uid);

        res.json({
            ok: true,
            uid,
            msg: 'Usuario borrado'
        });


    } catch(error) {
        console.log(error);
        return response.status(500).json({
            ok: false,
            msg: 'Error inesperado'
        })
    }

} 


module.exports = {
    getUsuarios,
    crearUsuario,
    actualizarUsuarios,
    borrarUsuario
}