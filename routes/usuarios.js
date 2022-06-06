/*
    Ruta: /api/usuarios
*/

const { Router } = require('express');
const { check } = require('express-validator');

const { getUsuarios, crearUsuario, actualizarUsuarios, borrarUsuario  } = require('../controllers/usuarios');
const { validarJWT, validarADMIN_ROLE, validarADMIN_ROLE_o_MismoUsuario } = require('../middlewares/validar-jwt');
const { validarCampos } = require('../middlewares/validarCampos');

const router = Router();

router.get('/', validarJWT, getUsuarios );

router.post('/', [
    check('nombre', 'El nombre es un campo obligatorio').not().isEmpty(),
    check('email', 'El campo Email es obligatorio').isEmail(),
    check('password', 'El largo de password debe ser de 6 caracteres').isLength({ min: 6 }),
    validarCampos,
], crearUsuario );

router.put('/:uid', [ 
    [ validarJWT, validarADMIN_ROLE_o_MismoUsuario ],
    check('nombre', 'El nombre es un campo obligatorio').not().isEmpty(),
    check('email', 'El campo Email es obligatorio').isEmail(),
    check('role', 'El role es obligatorio').not().isEmpty(),
    validarCampos,
], actualizarUsuarios );

router.delete('/:uid',
     [ validarJWT, validarADMIN_ROLE ],   
     borrarUsuario 
     );

module.exports = router;
