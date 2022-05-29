/*
    Hospitales
    Rutas: '/api/hospitales'
*/
const { Router } = require('express');
const { check } = require('express-validator');
const { validarJWT } = require('../middlewares/validar-jwt');
const { validarCampos } = require('../middlewares/validarCampos');
const {getHospitales, crearHospital, actualizarHospital, borrarHospital} = require('../controllers/hospitales');



const router = Router();

router.get('/', getHospitales );

router.post('/', [
    validarJWT,
    check('nombre', 'El nombre del hospital es necesaario').not().isEmpty(),
    validarCampos
], crearHospital );

router.put('/:id', [ 
    validarJWT,
    check('nombre', 'El nombre del hospital es necesaario').not().isEmpty(),
    validarCampos
], actualizarHospital );

router.delete('/:id',
     validarJWT,   
     borrarHospital 
);

module.exports = router;







